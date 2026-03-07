import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";
import { Octokit } from "octokit";

const app = express();
app.use(express.json({ limit: "1mb" }));

// === ENV (poner en Railway como secrets) ===
// ROYAL_CMD_SECRET  -> HMAC shared secret
// GITHUB_TOKEN      -> token personal
// VERCEL_TOKEN      -> token de despliegue

// Endpoint de status
app.get("/royal/status", (req, res) => {
  res.json({ ok: true, system: "AHT Sovereign Backend", time: new Date() });
});

// Endpoint de sync con validación HMAC
app.post("/royal/sync", (req, res) => {
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", process.env.ROYAL_CMD_SECRET);
  hmac.update(payload);
  const signature = `sha256=${hmac.digest("hex")}`;

  const received = req.headers["x-royal-signature"];
  if (signature !== received) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Aquí iría tu lógica de integración con GitHub/Vercel
  res.json({ ok: true, action: "sync executed" });
});

// Puerto dinámico para Railway/Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
