import 'dotenv/config';
import { Client, Intents } from 'discord.js';

import CommandsLoader from './modules/commands/CommandsLoader.js';
new CommandsLoader().update();


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });




client.on('ready', () => {
  console.log(`Logged in as ${client.user.id}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand())
    return;

  const command = globalThis.commands.get(interaction.commandName);

  let output = {ephemeral: true};
  try {
    if (!command)
      throw new Error("UNKNOW_COMMAND");

    const promise = command.run(interaction);
    if (!interaction.deffered && !iteration.replied)
      throw new Error("COMMAND_NOTHING_REPLY");

    ouput = await promise;
  } catch (err) {

  } finally {
    interaction.reply(ouput);
  }
});

export default client;
client.login(process.env.TOKEN);
