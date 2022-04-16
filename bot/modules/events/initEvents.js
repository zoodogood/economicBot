import fileSystem from 'fs';
import { Collection } from '@discordjs/collection';

class EventsLoader {

  async update(){
    const __dirname = `${ process.cwd() }`;
    globalThis.commands = new Collection();

    const files = fileSystem.readdirSync(`${ __dirname }/bot/events/`)
      .filter(name => /^[a-zA-Z].+?\.js/.test(name));

    for (const name of files) {
      const { Event } = await import(`file://${ __dirname }/bot/events/${ name }`);
      const event = new Event();


      globalThis.commands.set(event.name, event);
    }

    return;
  }
}

await new EventsLoader().update();
