console.clear();


class App {

  async load(){
    // bot
    const client = await import('./bot/main.js');
    this.client = client;
  }
}

globalThis.app = new App();
app.load();
