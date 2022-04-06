import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import CommandsLoader from './bot/modules/commands/CommandsLoader.js';
await new CommandsLoader().load();



const commandsData = globalThis.commands
  .map(command => {
    const { name, slash: {description, options, type = 1} } = command.constructor.data;
    return {name, description, options, type};
  })



const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

try {
  const clientId = (await rest.get( Routes.user() ))
    .id;

  console.info('----\nStarted refreshing application (/) commands.');

  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commandsData },
  );

  console.info('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
