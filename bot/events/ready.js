import BaseEvent from '../modules/events/BaseEvent.js';

class Event extends BaseEvent {
  constructor(){
    super(globalThis.app.client, "ready");
  }

  async run(interaction){
    console.clear();

    const timeSlice = process.uptime();
    const data = this.constructor.getDisplayData();
    console.info(this.constructor.COLORS.cyan, `\n\nLaunched in ${ timeSlice }ms:`);

    console.table({bot: data.bot});
    console.table({database: data.database});

    console.info(this.constructor.COLORS.cyan, "────────");
  }

  static getDisplayData(){
    return {
      bot: {users: 12, guilds: 1, commands: 3, events: 2},
      database: {users: 1, cash: 1}
    }
  }

  static COLORS = {
    cyan: "\x1b[32m%s\x1b[0m"
  }
}

export { Event };
