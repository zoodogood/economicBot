import BaseCommand from '../modules/commands/BaseCommand.js';

class Command extends BaseCommand {
  constructor() {
    super();
  }

  async run(interaction){
    interaction.deferReply({ ephemeral: true, fetchReply: true });

    await this.query.UPDATE_COUNTER.execute();
    const [rows] = await this.query.GET_COUNTER.execute();
    const value = rows.at(0);

    const content = `Currect counter value is ${ value.counter };`;
    return { content };
  }

  static data = {
    name: "dev_test",
    // Discord SlashCommands
    slash: {
      description: "null"
    }
  };


  static DATABASE_QUERIES = {
    UPDATE_COUNTER:
      "UPDATE `global` SET `counter` = `counter` + 1 WHERE `id` = 1",
    GET_COUNTER:
      "SELECT `counter` FROM `global` WHERE `id` = 1"
  }
}


export { Command };
