import fileSystem from 'fs';
import {Collection} from '@discordjs/collection';

class CommandsLoader {
  constructor(){


  }

  load(){
    const __dirname = `${ process.cwd() }`;
    globalThis.commands = new Collection();

    fileSystem.readdirSync(`${ __dirname }/bot/commands/`)
      .filter(name => /^[a-z].+?\.js/.test(name))
      .forEach(async name => {
        const { Command } = await import(`file://${ __dirname }/bot/commands/${ name }`);
        const command = new Command();

        globalThis.commands.set(command.name, command);
      })
  }
}


export default CommandsLoader;
