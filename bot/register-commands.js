import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID } = process.env;

// Define tus slash commands aquí
const commands = [
  {
    name: 'ping',
    description: 'Pong, laten mis bits 🏓'
  },
  {
    name: 'royal',
    description: 'Muestra el status del imperio 👑'
  }
];

async function main() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    if (GUILD_ID) {
      // Registro por servidor (instantáneo para desarrollo)
      await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log('✅ Slash commands (GUILD) registrados.');
    } else {
      // Registro global (tarda ~1h en propagar)
      await rest.put(
        Routes.applicationCommands(DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Slash commands (GLOBAL) registrados.');
    }
  } catch (err) {
    console.error('❌ Error registrando commands:', err);
    process.exit(1);
  }
}

main();
