import BaseCommand from '../modules/commands/BaseCommand.js';

class Command extends BaseCommand {
  constructor() {
    super();
  }

  run(interaction){
    const i18n = this.i18n.bind(null, interaction.locale);
    console.info( i18n("slashName") );

    this.query.UPDATE_COUNTER().execute();
    const [rows: [data]] = this.query.GET_COUNTER().execute();
    console.info( data ); // {id: 1, counter: ?}

    const content = "IT'S COMMAND SNIPPET. IS NOT A REAL COMMAND";
    return { content, ephemeral: true };
  }

  static data = {
    name: "__NAME__",
    // Discord SlashCommands
    slash: {
      description: "__DESCRIPTION__"
    }
  };


  static DATABASE_QUERIES = {
    UPDATE_COUNTER:
      () => "UPDATE `global` SET `counter` = `counter` + 1 WHERE `id` = 1",
    GET_COUNTER:
      () => "SELECT `counter` FROM `global` WHERE `id` = 1"
  }
}


export { Command };
