// backend/royal-sync-bot.js
import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";
import { Octokit } from "octokit";
import util from "util";

const app = express();
app.use(express.json({ limit: "1mb" }));

// === ENV (poner en Railway as secrets) ===
// ROYAL_CMD_SECRET  -> HMAC shared secret (string largo)
// GITHUB_TOKEN      -> token personal with repo scope
// VERCEL_TOKEN      -> token with deployments/env scope
// RAILWAY_TOKEN     -> token to update variables (if used)
// DISCORD_WEBHOOK   -> optional
// BASE_API_URL      -> https://api.streetemporioroyal.com

const CMD_SECRET = process.env.ROYAL_CMD_SECRET;
if (!CMD_SECRET) {
  console.error("FATAL: ROYAL_CMD_SECRET missing");
  process.exit(1);
}

function hmacHex(str) {
  return crypto.createHmac("sha256", CMD_SECRET).update(str).digest("hex");
}

function verifySignature(req) {
  const sig = (req.headers["x-royal-signature"] || "").toString();
  if (!sig) return false;
  const raw = JSON.stringify(req.body);
  const expected = hmacHex(raw);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// === Small helpers ===
async function githubCreateOrUpdateFile({ owner, repo, path, content, branch="main", message="update via royal-sync" }) {
  const b = await octokit.request('GET /repos/{owner}/{repo}/git/refs/heads/{branch}', { owner, repo, branch }).catch(()=>null);
  // create commit flow simplified: use createOrUpdateFileContents
  const existing = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path }).catch(()=>null);
  const encoded = Buffer.from(content).toString('base64');
  if (existing && existing.data && existing.data.sha) {
    const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', { owner, repo, path, message, content: encoded, sha: existing.data.sha, branch });
    return res.data;
  } else {
    const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', { owner, repo, path, message, content: encoded, branch });
    return res.data;
  }
}

async function vercelUpdateEnv({ projectId, key, value }) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN missing");
  const r = await fetch(`https://api.vercel.com/v8/projects/${projectId}/env`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key, value, target: ["production","preview"], type: "encrypted" })
  });
  const j = await r.json();
  return j;
}

async function railwaySetVariable({ projectId, key, value }) {
  const token = process.env.RAILWAY_TOKEN;
  if (!token) throw new Error("RAILWAY_TOKEN missing");
  // Railway has different endpoints per workspace; this is a placeholder example.
  const r = await fetch(`https://backboard.railway.app/graphql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation { createEnvironmentVariable(input:{projectId:"${projectId}", key:"${key}", value:"${value}"}){id} }` })
  });
  const j = await r.json();
  return j;
}

async function discordNotify(content) {
  const url = process.env.DISCORD_WEBHOOK;
  if (!url) return null;
  const r = await fetch(url, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ content }) });
  return r.status;
}

// === MAIN endpoint ===
app.post("/royal/sync", async (req, res) => {
  try {
    if (!verifySignature(req)) return res.status(401).json({ ok:false, msg:"invalid signature" });

    const { target, payload } = req.body; // target: github|vercel|railway|discord, payload: object
    if (!target || !payload) return res.status(400).json({ ok:false, msg:"missing target/payload" });

    let result = null;
    if (target === "github") {
      // payload: { owner, repo, path, content, branch?, message? }
      result = await githubCreateOrUpdateFile(payload);
    } else if (target === "vercel") {
      // payload: { projectId, key, value }
      result = await vercelUpdateEnv(payload);
    } else if (target === "railway") {
      // payload: { projectId, key, value }
      result = await railwaySetVariable(payload);
    } else if (target === "discord") {
      result = await discordNotify(payload.content || "royal sync");
    } else {
      return res.status(400).json({ ok:false, msg:"unknown target" });
    }

    // log can be expanded to a DB
    return res.json({ ok:true, result });
  } catch (e) {
    console.error("sync error:", e);
    return res.status(500).json({ ok:false, msg: e.message, stack: String(e.stack).slice(0,800) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Royal sync engine listening on ${PORT}`));
