// royal.server.js
// Royal EGI Blueprint API – listo para Railway
// Arranca en PORT (Railway) o 8080 local

import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8080;
const CORE_DOMAIN = process.env.CORE_DOMAIN || "api.streetemporioroyal.com";
const ALLOW_ORIGINS = (process.env.ALLOW_ORIGINS || "*")
  .split(",")
  .map(s => s.trim());

const DOMINION_ID = process.env.DOMINION_ID || "USER_ROSARITO_01";
const CITY = process.env.CITY || "Rosarito, Baja California";
const PROVIDER = process.env.PROVIDER || "Telcel";

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOW_ORIGINS.includes("*") || ALLOW_ORIGINS.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "royal-egi-blueprint", domain: CORE_DOMAIN });
});

// === 1) AEGIS PROTOCOL LIVE ALERT ===
app.get("/aegis/alert", (_req, res) => {
  const now = new Date();
  const tzOffset = -7; // Baja: PDT/UTC-7 aprox (ajústalo si quieres)
  const isoLocal = new Date(now.getTime() + tzOffset * 3600 * 1000)
    .toISOString()
    .replace("Z", `${tzOffset >= 0 ? "+" : "-"}${String(Math.abs(tzOffset)).padStart(2,"0")}:00`);

  res.json({
    aegis_timestamp: isoLocal,
    dominion_id: DOMINION_ID,
    alert_type: "THREAT_AND_OPPORTUNITY",
    threat_detected: {
      type: "Evil Twin AP",
      threat_source_ssid: "Cafe_Guadalupe_Libre",
      risk_level: "CRITICAL",
      action_taken: "Vector cut, pivot to Cellular (100% load), network immunize",
      user_impact: "ZERO",
    },
    opportunity_exploit: {
      type: "Bandwidth Arbitrage",
      event_trigger: "Post-Concert Crowd Dispersion",
      action_taken: "Paused background sync, offering 15Mbps on barter pool",
      potential_gain: "Estimated 2.5GB in connectivity credits",
      status: "EXECUTING",
    },
    comment:
      "AEGIS Protocol active. Threat neutralized. Exploiting network demand spike.",
  });
});

// === 2) ESTADO EN VIVO DEL SISTEMA DOMINION ===
app.get("/dominion/status", (_req, res) => {
  const now = new Date();
  const tz = "−07:00";
  const iso = now.toISOString().replace("Z", tz);

  res.json({
    dominion_id: DOMINION_ID,
    timestamp: iso,
    status: "ACTIVE_MOBILE",
    location_vector: {
      vehicle: "MOVING",
      route: "Carretera Escénica Tijuana-Ensenada",
      direction: "Southbound",
      current_reception_quality: 0.45, // señal débil
    },
    core_prediction: {
      active_task: "Streaming Audio",
      imminent_need_mins: 12,
      next_priority_event: "Videoconferencia (14:00)",
      confidence_score: 0.98,
    },
    sphere_action: {
      action_type: "PROACTIVE_CACHE",
      details:
        "Conexión ininterrumpida a través de zona de baja cobertura ('El Morro')",
      cache_content: ["Spotify Playlist 'Driving Mix'", "Email Inbox (IMAP)"],
      status: "COMPLETED_AT_12:45",
    },
    scepter_mode: "AUTOMATIC",
    note: `Dominio: ${CORE_DOMAIN}`,
  });
});

// === 3) SYNAPSE – BLUEPRINT CONCEPTUAL ===
app.get("/synapse/blueprint", (_req, res) => {
  const now = new Date().toISOString();

  res.json({
    timestamp: now,
    location: CITY,
    query_coordinates: { lat: 32.36, lon: -117.05 },
    synapse_action: "VECTOR_ROUTING_ADAPTIVE",
    primary_vector: {
      type: "WiFi",
      ssid: "Cafe_Guadalupe_Libre",
      latency_ms: 45,
      stability_score: 0.88,
      recommended_load_percentage: 60,
    },
    secondary_vector: {
      type: "Cellular",
      provider: PROVIDER,
      band: "5G_NSA",
      latency_ms: 22,
      stability_score: 0.95,
      recommended_load_percentage: 40,
    },
    micro_barter_pool: {
      status: "ACTIVE",
      available_peers: 14,
      potential_gain_mbps: 5,
    },
    predictive_alert: {
      event: "Network congestion predicted",
      location: "Zona Restaurantes Blvd. Juarez",
      eta_minutes: 47,
      action: "Proactive data caching initiated.",
    },
  });
});

// raíz
app.get("/", (_req, res) => {
  res.type("html").send("🚀 Bot corriendo<br>Endpoints: /health, /aegis/alert, /dominion/status, /synapse/blueprint");
});

app.listen(PORT, () => {
  console.log(`Royal EGI API on http://0.0.0.0:${PORT} (domain: ${CORE_DOMAIN})`);
});
