import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


const commands = [{
  name: 'help',
  description: 'Have fun!'
}];

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);



try {
  const clientId = (await rest.get( Routes.user() ))
    .id;

  console.info('----\nStarted refreshing application (/) commands.');

  const out = await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  );

  console.log(out);
  console.info('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
