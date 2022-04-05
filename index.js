console.clear();


class App {

  async load(){
    // bot
    const client = await import('./bot/main.js');
    this.client = client;
  }
}

console.log(EventTarget);
globalThis.app = new App();
app.load();
