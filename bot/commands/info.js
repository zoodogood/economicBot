import BaseCommand from '../modules/commands/BaseCommand.js';

class Command extends BaseCommand {
  constructor() {
    super();
  }

  run(interaction){
    const i18n = this.i18n.bind(this, interaction.locale);
    const content = i18n("slashName");
    return { content, ephemeral: true };
  }

  static data = {
    name: "info",
    // Discord SlashCommands
    slash: {
      description: "Display bot info"
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
