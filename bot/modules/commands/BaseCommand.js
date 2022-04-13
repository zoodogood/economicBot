import EventsEmitter from 'events';
import QueryManager from '@database/query-manager';

class BaseCommand extends EventsEmitter {
  constructor(){
    super();
  }

  async update(){
    const __dirname = process.cwd();
    const {Command} = await import(`file://${ __dirname }/bot/commands/${ this.name }.js`);
    const command = new Command();
    globalThis.commands.set(this.name, command);
  }

  get name(){
    return this.constructor.data.name;
  }

  query(){
    const queries = this.constructor.DATABASE_QUERIES;
    const queryProxy = new QueryManager(queries);
    return queryProxy;
  }
}


export default BaseCommand;
