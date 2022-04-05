import fileSystem from 'fs';

class CommandsLoader {
  constructor(){


  }

  load(){
    const __dirname = import.meta.url;
    globalThis.commands = [];

    fileSystem.readdirSync(`./bot/commands`)
      .filter(name => /^[a-z].+?\.js/.test(name))
      .map(async name => {
        const Command = await import(`${ __dirname }/../../../commands/${ name }`);
        return new Command();
      })
      .forEach(console.log);
  }
}


export default CommandsLoader;
