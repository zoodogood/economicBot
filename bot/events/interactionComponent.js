import BaseEvent from '../modules/events/BaseEvent.js';
import MethodsExecuter from '@global/methods-executer';

class Event extends BaseEvent {
  constructor(){
    super(globalThis.app.client, "interactionCreate");
  }

  checkCondition(interaction){
    return interaction.isMessageComponent();
  }

  async run(interaction){
    const id = interaction.customId;
    let reply = {ephemeral: true};
    try
    {
      const promise = new MethodsExecuter().execute(id, interaction);
      reply = await promise;
    }
    catch (err)
    {
      reply.content = err.message;
    }
    finally
    {
      interaction.reply(reply);
    }
  }
}

export { Event };
