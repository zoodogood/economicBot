import BaseCommand from '../modules/commands/BaseCommand.js';

class Command extends BaseCommand {
  constructor() {
    super();
  }

  run(interaction){
    const components = [
      new MessageActionRow({
        components:[{type: "BUTTON", label: "123", customId: "commands_help_test", style: 1}]
      })
    ];

    const embeds = [new MessageEmbed({title: "123"})];
    return { embeds, components, ephemeral: true };
  }

  static data = {
    name: "__NAME__",
    slash: {
      description: "__DESCRIPTION__"
    }
  };
}


export { Command };
