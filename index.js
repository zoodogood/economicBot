import 'dotenv/config';
import Database from '@database/database';

import EventsEmitter from 'events';
globalThis.events = new EventsEmitter();


class App {

  async load(){
    await this.initDatabase();

    await this.initClient();


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
}

globalThis.app = new App();
app.load();
