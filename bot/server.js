const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar el bot de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Endpoint para mantener vivo el servicio
app.get("/", (req, res) => {
  res.send("🚀 Street Emporio Royal Bot corriendo en Railway");
});

app.listen(PORT, () => {
  console.log(`Servidor web escuchando en puerto ${PORT}`);
});
