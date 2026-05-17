// backend/server.js
const express = require("express");
const app = express();
app.use(express.json());

// === 1) Estado vivo (mock realista) =======================
app.get("/dominionLiveState", (req, res) => {
  res.json({ status: "ACTIVE_MOBILE", message: "Dominio soberano activo" });
});

// === 2) Ensamblador de Directiva ==========================
app.post("/buildDirectiva", (req, res) => {
  const state = req.body;
  res.json({ directiva: "Resumen ejecutivo", state });
});

// === 3) Notificador opcional a Discord ====================
app.post("/notifyDiscord", (req, res) => {
  const { texto } = req.body;
  console.log("Notificando a Discord:", texto);
  res.json({ status: "sent", texto });
});

// === 4) Endpoint principal: Directiva =====================
app.get("/directiva", (req, res) => {
  res.send("// DIRECTIVA SOBERANA // Dominio protegido y optimizado.");
});

// === 5) Tarea manual: disparar y enviar a Discord =========
app.post("/royal_push_directiva", (req, res) => {
  res.json({ status: "pushed", target: "Discord" });
});

// Ejemplo de otras funciones del listado
app.post("/sendJSON", (req, res) => {
  res.json(req.body);
});

app.post("/logEvent", (req, res) => {
  console.log("Evento:", req.body);
  res.json({ status: "logged" });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor soberano corriendo en puerto ${PORT}`);
});

