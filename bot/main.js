import 'dotenv/config';
import { Client, Intents } from 'discord.js';

import CommandsLoader from './modules/commands/CommandsLoader.js';
new CommandsLoader().load();


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });




client.on('ready', () => {
  console.log(`Logged in as ${client.user.id}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand())
    return;

  const command = globalThis.commands.get(interaction.commandName);

  if (!command)
    interaction.reply( "Такой команды не существует" );



  const out = command.run(interaction);
  command.reply(out);

});

export default client;
client.login(process.env.TOKEN);
