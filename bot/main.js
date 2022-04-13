import 'dotenv/config';
import { Client, Intents } from 'discord.js';


import './modules/events/initEvents.js';
import './modules/commands/initCommands.js';


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const database = globalThis.app.database;




client.on('ready', () => {
  console.log(`Ready..`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand())
    return;

  const data = {
    userId: interaction.user
  }

  const command = globalThis.commands.get(interaction.commandName);

  let reply = {ephemeral: true};
  try {
    if (!command)
      throw new Error("UNKNOW_COMMAND");


    const promise = command.run(interaction);
    console.log("123");

    const isPromise = promise instanceof Promise;
    if (isPromise && !interaction.deffered && !interaction.replied)
      throw new Error("COMMAND_NOTHING_REPLY");

    reply = await promise;
  } catch (err) {
    reply.content = err.message;

  } finally {
    interaction.reply(reply);
  }
});

export default client;
client.login(process.env.TOKEN);
