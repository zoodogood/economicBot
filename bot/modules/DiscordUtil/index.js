import {MessageEmbed, MessageActionRow} from 'discord.js';

class MessageConstructor {
  constructor({
    content,
    title, url, author, thumbnail, description, color, fields, image, footer, timestamp,
    removing, ephemeral, fetchReply,
    components, reactions, webhook
  }){
    thumbnail &&= { url: trumbnail };
    image     &&= { url: image };

    color ||= "RANDOM";

    const embed = new MessageEmbed({
      title, url, author, thumbnail,
      description, color, fields,
      image, footer, timestamp
    });

    this.embeds = [embed];
    this.components = components ? new ComponentsSimplify().simplify(components) : null;

    this.content    = content;
    this.ephemeral  = ephemeral;
    this.fetchReply = fetchReply;
  }
}


class ComponentsSimplify {
  simplify(component){

    const isComponent  = (component) => "type" in component;
    const isActionRow  = (component) => (component instanceof Array && component.at(0)?.type) || component instanceof MessageActionRow;
    const isComponents = (component) => component.length && isActionRow(component.at(0));

    const argumentType = [
      isComponent(component),
      isActionRow(component),
      isComponents(component)
    ].findIndex(Boolean);

    if (argumentType === -1)
      throw new TypeError("expected component");


    if (argumentType === 0)
      component = [component];

    if (argumentType <= 1)
      component = component instanceof MessageActionRow ?
        component :
        {type: "ACTION_ROW", components: component};

    return [component];
  }
}

export default {MessageConstructor, ComponentsSimplify};
