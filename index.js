import 'dotenv/config';
import Database from '@database/database';
import Locales from '@global/locales';

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

    this.database = new Database({ user, password, host, database });
  }

  async initClient(){
    globalThis.events.on("bot/clientAvailable", client => {
      this.client = client;
    });
    await import('./bot/main.js');
  }

  async initLocales(){
    const locales = new Locales();
    globalThis.locales = locales.manager.bind(locales);
  }
}

globalThis.app = new App();
app.load();
