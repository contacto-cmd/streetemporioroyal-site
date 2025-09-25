// ===== HTTP (Express) =====
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';

// ===== Discord =====
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Partials,
  InteractionType,
} from 'discord.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middlewares enterprise
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// ===== Healthchecks y util
const startedAt = Date.now();

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/ready', (_req, res) => res.status(200).json({ ready: true }));
app.get('/', (_req, res) => {
  res
    .status(200)
    .send('👑 Royal backend vivo (Railway) – OK');
});
app.get('/status', (_req, res) => {
  res.json({
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    env: process.env.NODE_ENV || 'dev',
    guildId: process.env.GUILD_ID || null,
    clientId: process.env.DISCORD_CLIENT_ID || null,
  });
});

// ===== Arranque HTTP con cierre limpio
const server = app.listen(PORT, () => {
  console.log(`🚂 Railway on :${PORT}`);
});
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
  });
}

// ====== Discord Bot (slash) ======
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

// ——— Comandos
const commands = [
  { name: 'ping', description: 'Responde con Pong + latencia' },
  { name: 'royal', description: 'Status del bot/servicio' },
];

// ——— Registro de comandos (rápido en GUILD si existe; si no, globales)
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const appId = process.env.DISCORD_CLIENT_ID;

  if (!appId) throw new Error('Falta DISCORD_CLIENT_ID');
  if (!process.env.DISCORD_TOKEN) throw new Error('Falta DISCORD_TOKEN');

  if (process.env.GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(appId, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registrados en GUILD');
  } else {
    await rest.put(Routes.applicationCommands(appId), { body: commands });
    console.log('✅ Slash commands GLOBALS registrados');
  }
}

// ——— Eventos
client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'Royal online', type: 0 }],
    status: 'online',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  try {
    if (interaction.commandName === 'ping') {
      const sent = Date.now();
      await interaction.reply({ content: 'Pong! ⏱️' });
      const diff = Date.now() - sent;
      await interaction.followUp({ content: `Latencia ~ ${diff}ms` });
      return;
    }

    if (interaction.commandName === 'royal') {
      await interaction.reply({
        content:
          `👑 Royal OK\n` +
          `Uptime: ${Math.floor((Date.now() - startedAt) / 1000)}s\n` +
          `Env: ${process.env.NODE_ENV || 'dev'}`,
        ephemeral: true,
      });
      return;
    }
  } catch (e) {
    console.error('❌ Error command:', e);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: '❌ Ocurrió un error. Intenta de nuevo.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '❌ Ocurrió un error. Intenta de nuevo.',
        ephemeral: true,
      });
    }
  }
});

// ===== Arranque Discord
(async () => {
  await registerCommands();
  await client.login(process.env.DISCORD_TOKEN);
})();
