import BaseCommand from '../modules/commands/BaseCommand.js';

class Command extends BaseCommand {
  constructor() {
    super();
  }

  static data = {
    name: "help"
  }
}


export { Command };
