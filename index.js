console.clear();
import 'dotenv/config';
import Database from '@database/database';


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
    const client = await import('./bot/main.js');
    this.client = client;
  }
}

globalThis.app = new App();
app.load();
