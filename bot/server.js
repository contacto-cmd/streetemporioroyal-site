// server.js
require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// --- BOT DISCORD ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase() === "!ping") {
    message.reply("🏓 Pong! El bot está activo desde Vercel 💎👑");
  }
});

client.login(process.env.DISCORD_TOKEN);

// --- WEB EXPRESS ---
app.get("/", (req, res) => {
  res.send("🌐 Backend de Street Emporio Royal corriendo en Vercel 🚀👑");
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor Express escuchando en puerto ${PORT}`);
});

module.exports = app;
