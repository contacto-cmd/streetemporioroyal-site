import { Client, GatewayIntentBits, REST, Routes, InteractionType } from 'discord.js';
import 'dotenv/config';

export async function startBot() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const commands = [
    { name: 'ping',  description: 'Responde con pong y latencia' },
    { name: 'royal', description: 'Estado del sistema Royal' }
  ];

  async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    if (process.env.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      console.log('✅ Slash commands GUILD registrados');
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('✅ Slash commands GLOBAL registrados');
    }
  }

  client.once('ready', () => console.log(`🤖 Bot conectado como ${client.user.tag}`));

  client.on('interactionCreate', async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    try {
      if (interaction.commandName === 'ping') {
        await interaction.reply({ content: `🏓 Pong! ${Date.now() - interaction.createdTimestamp}ms` });
      }
      if (interaction.commandName === 'royal') {
        await interaction.reply({ content: '👑 Royal ok — web y bot High-Pro.' });
      }
    } catch (e) {
      console.error('❌ Error command:', e);
      if (interaction.deferred || interaction.replied) await interaction.followUp({ content: 'Error interno' });
      else await interaction.reply({ content: 'Error interno', ephemeral: true });
    }
  });

  await registerCommands();
  await client.login(process.env.DISCORD_TOKEN);
}
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/ready',  (_, res) => res.status(200).send('ready'));
app.get('/',       (_, res) => res.type('text/plain').send('🤖 Royal bot running'));

app.listen(PORT, () => console.log(`HTTP healthcheck on :${PORT}`));
