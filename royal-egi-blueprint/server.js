import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: process.env.ALLOW_ORIGINS || "*" }));
app.use(express.json());

// --- Helper para leer variables del entorno ---
const env = (key, def = "") => process.env[key] ?? def;

// --- CORE ROYAL ---
const CORE = {
  DOMAIN: env("CORE_DOMAIN", "streetemporioroyal.com"),
  MODE: env("CORE_MODE", "AUTO"),
  SIGN: env("CORE_SIGNATURE", "KonfethYzjaj")
};

// --- MÓDULOS EGI / AEGIS ---
const AEGIS = {
  BLUEPRINT: env("AEGIS_BLUEPRINT", "{}"),
  ANTI_MODE: env("ANTI_MODE", "SAFE"),
  ANTI_CORE: env("ANTI_BLINDAJE_CORE", "{}")
};

// --- MÓDULO SYNAPSE ---
const SYNAPSE = {
  REGION: env("SYNAPSE_REGION", "us-east"),
  VECTOR: env("SYNAPSE_VECTOR", "HYBRID_SMART")
};

// --- ENDPOINTS ---
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "royal-egi-blueprint",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "ONLINE",
    core: {
      domain: CORE.DOMAIN,
      mode: CORE.MODE,
      signature: CORE.SIGN
    },
    synapse: {
      region: SYNAPSE.REGION,
      vector: SYNAPSE.VECTOR
    }
  });
});

app.get("/api/blueprint", (req, res) => {
  let bp = {};
  try { bp = JSON.parse(AEGIS.BLUEPRINT); } catch {}
  res.json({
    blueprint: bp,
    anti_mode: AEGIS.ANTI_MODE
  });
});

app.get("/api/anti", (req, res) => {
  let core = {};
  try { core = JSON.parse(AEGIS.ANTI_CORE); } catch {}
  res.json({
    anti_blindaje: {
      enabled: AEGIS.ANTI_MODE !== "OFF",
      core_meta: Object.keys(core)
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Royal EGI Blueprint activo en el puerto ${PORT}`)
);
