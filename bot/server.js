// server.js — Royal Bot estable en Railway
require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// --- HTTP (para que Railway vea que el service está vivo)
app.get("/", (_, res) => res.send("👑 Royal Bot online (Railway)"));
app.get("/health", (_, res) => res.json({ ok: true, service: "royal-bot" }));

// --- Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // activa este intent en Discord Dev Portal
  ],
});

client.once("ready", () => console.log(`🤖 Bot conectado como ${client.user.tag}`));

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase().startsWith("!ping")) {
    return msg.reply("🏓 Pong! Online y con estilo Royal.");
  }
});

// ---- Arranque ordenado + protección de errores
app.listen(PORT, () => console.log(`HTTP ok en puerto ${PORT}`));

(async () => {
  try {
    if (!process.env.DISCORD_TOKEN) throw new Error("Falta DISCORD_TOKEN");
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    setTimeout(() => process.exit(1), 10000); // deja el log visible si falla
  }
})();

process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));
