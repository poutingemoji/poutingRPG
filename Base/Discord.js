//BASE
const { MessageAttachment, MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../pouting-rpg/data/emojis");

//UTILS
const Pagination = require("../utils/discord/Pagination");
const enumHelper = require("../utils/enumHelper");

class Discord {
  constructor(client) {
    this.client = client;

    this.Pagination = new Pagination(this);
  }

  healthBar(currentHP, totalHP) {
    return `${this.progressBar(currentHP / totalHP, 13, "█", "░")} \`[${currentHP}/${totalHP}]\` ❤`
  }

  progressBar(progress, maxLength, progressEmoji, emptyEmoji) {
    const length = Math.max(0, Math.round(progress * maxLength));
    return `${this.emoji(progressEmoji).repeat(length)}${this.emoji(
      emptyEmoji
    ).repeat(maxLength - length)}`;
  }

  confirmation(msg, response) {
    return msg.reply(response).then(async (msgSent) => {
      const res = await this.awaitResponse({
        type: "reaction",
        author: msg.author.id,
        msg: msgSent,
        chooseFrom: ["green_check", "red_cross"],
      });
      return res == "green check";
    });
  }

  emoji(emoji) {
    emoji = emoji.replace(/ /g, "_");
    return isNaN(emojis[emoji])
      ? emojis[emoji] || emoji
      : this.client.emojis.cache.get(emojis[emoji]).toString();
  }

  buildEmbed(params) {
    //prettier-ignore
    const { Embed,
      color, thumbnail, 
      title, author, description, 
      filePath, fileName = "nicetry", 
      image, footer 
    } = params;

    const messageEmbed = Embed || new MessageEmbed();
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
    if (footer && !Embed) messageEmbed.setFooter(footer);
    return messageEmbed;
  }

  async awaitResponse(params) {
    let {
      type,
      author,
      msg,
      chooseFrom,
      deleteOnResponse = true,
      reactToMessage = true,
      removeAuthorReaction = false,
    } = params;
    enumHelper.waitingOnResponse.add(author);
    if (!Array.isArray(chooseFrom)) {
      if (typeof chooseFrom == "object") {
        chooseFrom = Object.keys(chooseFrom);
      } else {
        return;
      }
    }

    switch (type) {
      case "message":
        break;
      case "reaction":
        if (reactToMessage) {
          for (let choice of chooseFrom) {
            choice = choice.replace(/ /g, "_");
            console.log(choice);
            await msg.react(emojis[choice] || choice);
          }
        }

        const reactionFilter = (reaction, user) => {
          return (
            (chooseFrom.includes(reaction.emoji.name.replace(/_/g, " ")) ||
              chooseFrom.includes(reaction.emoji.name.replace(/ /g, "_"))) &&
            user.id === author
          );
        };

        return msg
          .awaitReactions(reactionFilter, {
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then((collected) => {
            if (deleteOnResponse) msg.delete();
            if (removeAuthorReaction) {
              msg.reactions
                .resolve(
                  collected.first().emoji.id
                    ? collected.first().emoji.id
                    : collected.first().emoji.name
                )
                .users.remove(author);
            }

            enumHelper.waitingOnResponse.clear(author);
            return collected.first().emoji.name.replace(/_/g, " ");
          })
          .catch((error) => {
            console.log(error);
            if (deleteOnResponse) msg.delete();
            enumHelper.waitingOnResponse.clear(author);
          });
    }
  }
}

module.exports = Discord;
