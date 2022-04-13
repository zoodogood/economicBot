import 'dotenv/config';
import { Client, Intents } from 'discord.js';



import './modules/events/initEvents.js';
import './modules/commands/initCommands.js';


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });




client.on('ready', () => {
  console.log(`Logged in as ${client.user.id}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand())
    return;

  const command = globalThis.commands.get(interaction.commandName);

  let reply = {ephemeral: true};
  try {
    if (!command)
      throw new Error("UNKNOW_COMMAND");

    const promise = command.run(interaction);

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
