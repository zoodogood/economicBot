import 'dotenv/config';
import Database from '@database/database';
import LocalesStructure from '@global/locales';

import EventsEmitter from 'events';
globalThis.events = new EventsEmitter();


class App {

  async load(){
    const modules = ["initDatabase", "initLocales", "initClient"];
    for (const initName of modules){
      console.time(initName);
      await this[initName]();

      console.timeEnd(initName);
    }
  }

  async initDatabase(){
    const {
      DATABASE_USER: user,
      DATABASE_PASSWORD: password,
      DATABASE_HOST: host,
      DATABASE_NAME: database
    } = process.env;

    this.database = await new Database({ user, password, host, database })
      .whenPool;

    if (this.database === undefined){
      console.error("The database did not pass the startup check.\nExit");
      process.exit(1);
    }
  }

  async initClient(){
    globalThis.events.on("bot/clientAvailable", client => {
      this.client = client;
    });
    await import('./bot/main.js');
  }

  async initLocales(){
    globalThis.i18n = new LocalesStructure();
  }
}

globalThis.app = new App();
app.load();
