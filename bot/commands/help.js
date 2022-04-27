import BaseCommand from '../modules/commands/BaseCommand.js';
import {MessageEmbed, MessageActionRow, MessagePayload} from 'discord.js';
import DiscordUtil from '@bot/discord-util';

const {MessageConstructor} = DiscordUtil;


class Command extends BaseCommand {
  constructor() {
    super();
  }

  run(interaction){
    const message = new MessageConstructor({content: "r-r-r", title: "red", components: {style: 1, type: 2, customId: "command_help_Test", label: "typein" }});
    return message;
  }

  onTest(interaction){
    return {content: interaction.user.username + interaction.locale};
  }

  static data = {
    name: "help",
    slash: {
      description: "Have fun!"
    }
  }
}


export { Command };
