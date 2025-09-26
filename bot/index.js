// ===== Carga env =====
import 'dotenv/config';

// ===== HTTP (Express) =====
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
  InteractionType,
} from 'discord.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares enterprise
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.json());

// Healthchecks
app.get('/health', (_, res) => res.status(200).json({ ok: true }));
app.get('/ready',  (_, res) => res.status(200).json({ ready: true }));

// Home
app.get('/', (_, res) => {
  res.type('text/plain').send('👑 Royal backend vivo (Railway)');
});

// Arranque HTTP + cierre elegante
const server = app.listen(PORT, () => {
  console.log(`🚂 Railway on :${PORT}`);
});
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}

// ===== Discord Bot (slash commands) =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Comandos
const commands = [
  {
    name: 'ping',
    description: 'Responde con Pong y latencia',
  },
  {
    name: 'royal',
    description: 'Status del backend y dominio',
  },
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const appId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!appId) {
    console.warn('⚠️ Falta DISCORD_CLIENT_ID; registro omitido');
    return;
  }

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(appId, guildId), {
      body: commands,
    });
    console.log('✅ Slash commands registrados en GUILD');
  } else {
    await rest.put(Routes.applicationCommands(appId), { body: commands });
    console.log('✅ Slash commands GLOBALS registrados');
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  try {
    if (interaction.commandName === 'ping') {
      const now = Date.now();
      await interaction.reply({ content: 'Pong! ⏱️' });
      const latency = Date.now() - now;
      await interaction.followUp(`Latencia aprox: **${latency} ms**`);
      return;
    }

    if (interaction.commandName === 'royal') {
      // pequeño status del backend
      const deployUrl =
        process.env.DEPLOY_URL ||
        'https://streetemporioroyal.com'; // personaliza
      await interaction.reply({
        content: `👑 Royal ok. Health: \`/health\` · Web: ${deployUrl}`,
      });
      return;
    }
  } catch (e) {
    console.error('❌ Error command:', e);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'Error interno 🔧', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Error interno 🔧', ephemeral: true });
    }
  }
});

// Arranque Discord
await registerCommands();
await client.login(process.env.DISCORD_TOKEN);
