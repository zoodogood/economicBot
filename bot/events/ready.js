import BaseEvent from '../modules/events/BaseEvent.js';

class Event extends BaseEvent {
  constructor(){
    super(globalThis.app.client, "ready");
  }

  async run(interaction){
    console.clear();

    const timeSlice = process.uptime();
    const data = this.constructor.getDisplayData();
    console.info(this.constructor.COLORS.green, `\n\nLaunched in ${ timeSlice * 1000 }ms:`);

    console.table({bot: data.bot});
    console.table({database: data.database});

    console.info(this.constructor.COLORS.green, "────────");
    console.log(globalThis.locales("ru-ru").commands.test);
  }

  static getDisplayData(){
    const client = globalThis.app.client;

    return {
      bot: {
        guilds:   client.guilds.cache.size,
        commands: globalThis.commands.size,
        events:   globalThis.eventsList.size
      },
      database: {
        users: 1, cash: 1
      }
    }
  }

  static COLORS = {
    green: "\x1b[32m%s\x1b[0m"
  }
}

export { Event };
