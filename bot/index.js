import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("StreetEmporioRoyal Bot is running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
