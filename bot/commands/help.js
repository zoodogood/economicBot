import BaseCommand from '../modules/commands/BaseCommand.js';
import {MessageEmbed, MessageActionRow} from 'discord.js';

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
    name: "help",
    slash: {
      description: "Have fun!"
    }
  }
}


export { Command };
