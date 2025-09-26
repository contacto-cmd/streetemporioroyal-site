import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
  { name: 'ping',  description: 'Responde con pong y latencia' },
  { name: 'royal', description: 'Estado del sistema Royal' }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  if (process.env.GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    console.log('✅ Guild commands listos');
  } else {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ Global commands listos');
  }
})();
