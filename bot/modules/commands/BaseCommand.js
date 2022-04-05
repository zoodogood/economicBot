import EventsEmitter from 'events';

class BaseCommand extends EventsEmitter {
  constructor(){
    super();
  }

  async update(){
    const __dirname = process.cwd();
    const {Command} = await import(`file://${ __dirname }/bot/commands/${ this.name }`);
    const command = new Command();
    globalThis.commands.set(this.name, command);
  }

  get name(){
    return this.constructor.data.name;
  }
}


export default BaseCommand;
