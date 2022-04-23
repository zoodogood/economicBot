import BaseEvent from '../modules/events/BaseEvent.js';

class Event extends BaseEvent {
  constructor(){
    super(globalThis.app.client, "interactionCreate");
  }

  checkCondition(interaction){
    return interaction.isCommand();
  }

  async run(interaction){
    const command = globalThis.commands.get(interaction.commandName);
    let reply = {ephemeral: true};

    try
    {
      if (!command)
        throw new Error("UNKNOW_COMMAND");

      const promise = command.run(interaction);
      reply = await promise;

    }
    catch (err)
    {
      reply.content = err.message;
    }
    finally
    {
      interaction.reply(reply);
    };

  }
}

export { Event };
