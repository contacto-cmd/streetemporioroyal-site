const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares web
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json());

// endpoints para healthcheck
app.get("/healthz", (_, res) => res.status(200).send("ok"));
app.get("/ready",  (_, res) => res.status(200).send("ready"));
app.get("/",       (_, res) => res.status(200).send("🚀 Bot corriendo"));

// bot de discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// levantar http
app.listen(PORT, () => {
  console.log(`HTTP escuchando en :${PORT}`);
});
