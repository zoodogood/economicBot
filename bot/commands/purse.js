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
    name: "purse",
    slash: {
      description: "Server monetary fund",
      options: [
        {
          type: 1,
          name: "take",
          description: "Take currency of the general Bank",
          options: [
            {
              type: 4,
              name: "amount",
              description: "amount of currency",
              choices: [
                {
                  name: "all",
                  value: -1
                }
              ],
              required: true
            }
          ]
        },
        {
          type: 1,
          name: "put",
          description: "Put currency into general Bank",
          options: [
            {
              type: 4,
              name: "amout",
              description: "amount of currency",
              choices: [
                {
                  name: "all",
                  value: -1
                }
              ],
              required: true
            }
          ]
        }
      ]
    }
  };
}


export { Command };
