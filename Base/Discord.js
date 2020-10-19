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

  confirmation(msg, response) {
    return msg.reply(response).then(async (msgSent) => {
      const res = await this.awaitResponse({
        type: "reaction",
        author: msg.author.id,
        msg: msgSent,
        chooseFrom: ["green check", "red cross"],
      });
      console.log(res);
      return res == "green check";
    });
  }

  emoji(emoji) {
    return isNaN(emojis[emoji])
      ? emojis[emoji]
      : this.client.emojis.cache.get(emojis[emoji]).toString();
  }

  buildEmbed(params) {
    const {
      color,
      thumbnail,
      title,
      author,
      description,
      filePath,
      fileName = "nicetry",
      image,
      footer,
    } = params;
    const messageEmbed = new MessageEmbed();
    if (color) messageEmbed.setColor(color);
    if (thumbnail) messageEmbed.setThumbnail(thumbnail);

    if (title)
      messageEmbed.setTitle(`${author ? `${author.username}'s ` : ""}${title}`);
    if (description) messageEmbed.setDescription(description);
    if (filePath) {
      const attachment = new MessageAttachment(filePath, `${fileName}.png`);
      messageEmbed.attachFiles(attachment);
      messageEmbed.setImage(`attachment://${fileName}.png`);
    }
    if (image) messageEmbed.setImage(image);
    if (footer) messageEmbed.setFooter(footer);
    return messageEmbed;
  }

  async awaitResponse(params) {
    let { type, author, msg, chooseFrom } = params;
    switch (type) {
      case "message":
        break;
      case "reaction":
        if (!Array.isArray(chooseFrom)) {
          if (typeof chooseFrom == "object") {
            chooseFrom = Object.keys(chooseFrom);
          } else {
            return;
          }
        } 

        this.waitingOnResponse.add(author);
        for (const option of chooseFrom) await msg.react(emojis[option]);

        const filter = (reaction, user) => {
          return (
            chooseFrom.includes(reaction.emoji.name.replace(/_/g, " ")) &&
            user.id === author
          );
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
