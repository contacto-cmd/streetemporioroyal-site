// bot.js
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// Crea cliente de Discord con permisos para leer y mandar mensajes
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Evento: listo
client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// Evento: mensaje
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ping") {
    message.reply("🏓 Pong! El bot está activo 🚀");
  }
});

// Conecta con el token del .env
client.login(process.env.DISCORD_TOKEN);
