//BASE
const { MessageAttachment, MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../pouting-rpg/data/emojis");
const enumHelper = require("../utils/enumHelper");

class Discord {
  constructor(client) {
    this.client = client;
    this.waitingOnResponse = new Set();
  }

  emoji(emoji) {
    return isNaN(emojis[emoji])
      ? emojis[emoji]
      : this.client.emojis.cache.get(emojis[emoji]).toString();
  }

  buildEmbed(params) {
    const {
      color,
      title,
      author,
      description,
      filePath,
      fileName = "nicetry",
      footer,
    } = params;
    const messageEmbed = new MessageEmbed();
    if (color) messageEmbed.setColor(color);
    if (title)
      messageEmbed.setTitle(`${author ? `${author.username}'s ` : ""}${title}`);
    if (description) messageEmbed.setDescription(description);
    if (filePath) {
      const attachment = new MessageAttachment(filePath, `${fileName}.png`);
      messageEmbed.attachFiles(attachment);
      messageEmbed.setImage(`attachment://${fileName}.png`);
    }
    if (footer) messageEmbed.setFooter(footer);
    return messageEmbed;
  }

  async awaitResponse(params) {
    var { type, author, msg, chooseFrom } = params;
    if (this.waitingOnResponse.has(author)) return false;
    switch (type) {
      case "message":
        break;
      case "reaction":
        if (typeof chooseFrom == "object") {
          chooseFrom = Object.keys(chooseFrom);
        } else if (!(typeof chooseFrom == "array")) return;
        this.waitingOnResponse.add(author);
        for (const option of chooseFrom) await msg.react(emojis[option]);

        const filter = (reaction, user) => {
          return chooseFrom.includes(reaction.emoji.name) && user.id === author;
        };
        return msg
          .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
          .then((collected) => {
            msg.delete();
            this.waitingOnResponse.clear(author);
            return collected.first().emoji.name.replace(/_/g, " ");
          })
          .catch((error) => {
            console.log(error);
            msg.delete();
            this.waitingOnResponse.clear(author);
          });
    }
  }
}

module.exports = Discord;
