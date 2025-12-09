#!/bin/bash
set -e

# Cambia este nombre si quieres otro repo local
REPO_NAME="royal-streetemporioroyal-engine"
echo "Creando repo local: $REPO_NAME"
rm -rf "$REPO_NAME"
mkdir -p "$REPO_NAME"
cd "$REPO_NAME"

# Estructura de carpetas
mkdir -p backend docs

# 1) backend/royal-sync-bot.js
cat > backend/royal-sync-bot.js <<'JS'
/* backend/royal-sync-bot.js
   Royal Sync Engine - recibe payloads firmados (HMAC-SHA256) y ejecuta acciones seguras:
   - github: create/update file
   - vercel: create env
   - railway: set variable (placeholder)
   - discord: notify webhook
   IMPORTANT: configure secrets in Railway (ROYAL_CMD_SECRET, GITHUB_TOKEN, VERCEL_TOKEN, RAILWAY_TOKEN, DISCORD_WEBHOOK)
*/
import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";
import { Octokit } from "octokit";

const app = express();
app.use(express.json({ limit: "1mb" }));

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
  } catch { return false; }
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Helper: create or update file on GitHub
async function githubCreateOrUpdateFile({ owner, repo, path, content, branch="main", message="update via royal-sync" }) {
  const encoded = Buffer.from(content).toString('base64');
  // try get file to know if update or create
  const existing = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path }).catch(()=>null);
  if (existing && existing.data && existing.data.sha) {
    const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner, repo, path, message, content: encoded, sha: existing.data.sha, branch
    });
    return res.data;
  } else {
    const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner, repo, path, message, content: encoded, branch
    });
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
  return r.json();
}

async function railwaySetVariable({ projectId, key, value }) {
  const token = process.env.RAILWAY_TOKEN;
  if (!token) throw new Error("RAILWAY_TOKEN missing");
  // Placeholder GraphQL mutation — puede requerir ajuste según tu workspace Railway.
  const r = await fetch(`https://backboard.railway.app/graphql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation { createEnvironmentVariable(input:{projectId:"${projectId}", key:"${key}", value:"${value}"}){id} }` })
  });
  return r.json();
}

async function discordNotify(content) {
  const url = process.env.DISCORD_WEBHOOK;
  if (!url) return null;
  const r = await fetch(url, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ content }) });
  return r.status;
}

app.post("/royal/sync", async (req, res) => {
  try {
    if (!verifySignature(req)) return res.status(401).json({ ok:false, msg:"invalid signature" });

    const { target, payload } = req.body;
    if (!target || !payload) return res.status(400).json({ ok:false, msg:"missing target/payload" });

    let result = null;
    if (target === "github") {
      result = await githubCreateOrUpdateFile(payload);
    } else if (target === "vercel") {
      result = await vercelUpdateEnv(payload);
    } else if (target === "railway") {
      result = await railwaySetVariable(payload);
    } else if (target === "discord") {
      result = await discordNotify(payload.content || "royal sync");
    } else {
      return res.status(400).json({ ok:false, msg:"unknown target" });
    }

    return res.json({ ok:true, result });
  } catch (e) {
    console.error("sync error:", e);
    return res.status(500).json({ ok:false, msg: e.message, stack: String(e.stack).slice(0,800) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Royal sync engine listening on ${PORT}`));
JS

# 2) backend/package.json
cat > backend/package.json <<'JSON'
{
  "name":"royal-streetemporioroyal-engine",
  "version":"1.0.0",
  "main":"backend/royal-sync-bot.js",
  "scripts":{"start":"node backend/royal-sync-bot.js"},
  "dependencies":{
    "express":"^4.18.2",
    "node-fetch":"^2.6.7",
    "octokit":"^2.0.0"
  },
  "type":"module"
}
JSON

# 3) docs/COMMANDS.md
cat > docs/COMMANDS.md <<'MD'
# COMMANDS — royal-streetemporioroyal-engine

## Firma HMAC (ejemplo)
RAW JSON a firmar (ejemplo github update file):
{"target":"github","payload":{"owner":"TU_USER","repo":"royal-streetemporioroyal-engine","path":"backend/hello.txt","content":"hola royal"}}

Generar firma (Linux/macOS/Termux/iSH):
RAW='{"target":"github","payload":{"owner":"TU_USER","repo":"royal-streetemporioroyal-engine","path":"backend/hello.txt","content":"hola royal"}}'
SIG=$(echo -n "$RAW" | openssl dgst -sha256 -hmac "TU_ROYAL_CMD_SECRET" -hex | sed 's/^.* //')

Curl ejemplo (envía al sync engine):
curl -X POST https://api.streetemporioroyal.com/royal/sync \
  -H "Content-Type: application/json" \
  -H "X-Royal-Signature: $SIG" \
  -d "$RAW"

## Ejemplo: actualizar variable en Railway (payload)
RAW='{"target":"railway","payload":{"projectId":"PROJECT_ID","key":"MY_KEY","value":"MY_VALUE"}}'
# Firma + curl como arriba.

## Ejemplo: actualizar env en Vercel
RAW='{"target":"vercel","payload":{"projectId":"VERCEL_PROJECT_ID","key":"NEXT_PUBLIC_API_BASE","value":"https://api.streetemporioroyal.com"}}'

## Nota de seguridad
- Nunca pegues ROYAL_CMD_SECRET en repos públicos.
- Rota el secreto si sospechas exposición.
- Todas las acciones quedan registradas en logs del servicio.
MD

# 4) throne-protocol-v3.json (manifiesto minimal)
cat > throne-protocol-v3.json <<'JSON'
{
  "name":"throne-protocol-v3",
  "owner":"Roberto Rivera Gamas",
  "project":"royal-streetemporioroyal-engine",
  "description":"Royal Hub Main - Sync engine for GitHub, Railway, Vercel and Discord.",
  "created":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

# 5) Init git
git init
git add .
git commit -m "Init royal-streetemporioroyal-engine - sync engine, package.json and docs"
echo "Repositorio local creado en $(pwd)"
echo "Siguiente: crea el repo en GitHub y 'git remote add origin <repo_url>' y 'git push -u origin main'"
