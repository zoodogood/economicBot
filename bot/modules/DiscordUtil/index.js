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
    const argumentType = [
      (component.at?.(0) instanceof Array),
      ("type" in component.at?.(0)),
      ("type" in component)
    ].findIndex(Boolean);

    if (argumentType === -1)
      throw new TypeError();

    if (argumentType === 1)
      component = {type: "ACTION_ROW", components: [component]}

    component = new MessageActionRow(component);
    return [component];
  }
}

export default {MessageConstructor, ComponentsSimplify};
