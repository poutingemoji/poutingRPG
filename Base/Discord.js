//BASE
const BaseHelper = require("./Helper");
const { MessageAttachment, MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../data/emojis");

//UTILS
const Pagination = require("../utils/discord/Pagination");
const enumHelper = require("../utils/enumHelper");

class Discord extends BaseHelper {
  constructor(client) {
    super();
    this.client = client;
    this.Pagination = new Pagination(this);
  }

  getObjInfo(obj) {
    //prettier-ignore
    return this.buildEmbed({
      title: `${obj.hasOwnProperty("position") ? `${this.emoji(obj.position.emoji)} ` : ""}${obj.name}`,
      description: `
      ❤️ **HP**: ${obj.HP}
      🗡️ **ATK**: ${obj.ATK}
      
      __Talents__
      ${Object.keys(obj.talents).map(
        (talentType) =>  `${this.emoji(enumHelper.talentTypes[talentType].emoji)} **${obj.talents[talentType].name}**: ${obj.talents[talentType].description}`
        ).join("\n")}`
    })
  }

  async confirmation(params) {
    const { author, msg, response } = params;
    const awaitParams = {
      author: response ? msg.author : author,
      msg: response ? await msg.reply(response) : msg,
      type: "reaction",
      chooseFrom: ["green_check", "red_cross"],
      responseWaitTime: enumHelper.responseWaitTime,
    }
    response ? awaitParams.deleteOnResponse = true : awaitParams.removeAllReactions = true;
    const res = await this.awaitResponse(awaitParams);
    return res == "green_check";
  }

  emoji(str) {
    let emojiId;
    emojiId = this.client.emojis.cache.get(str)
      ? str //already emojiId
      : emojis[emojis.hasOwnProperty(str) ? str : this.camelToSnakeCase(str)]; //was an emoji name or try to make it an emoji name
    if (!this.client.emojis.cache.get(emojiId)) {
      return emojis.hasOwnProperty(str)
        ? emojiId
        : this.containsOnlyEmojis(str); //return the unicode emoji or a blank string
    }
    return this.client.emojis.cache.get(emojiId).toString(); //return the custom emoji
  }

  buildEmbed(params) {
    const {
      author,
      color,
      description,
      embed,
      fileName = "default",
      filePath,
      footer,
      image,
      thumbnail,
      title,
    } = params;

    const messageEmbed = embed || new MessageEmbed();
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
    const {
      author,
      msg,
      type,
      reactToMessage = true,
      removeAllReactions = false,
      removeResponses = false,
      deleteOnResponse = false,
      filter,
    } = params;
    if (!["message", "reaction"].includes(type)) return;
    enumHelper.waitingOnResponse.add(author.id);

    let { chooseFrom, responseWaitTime } = params;
    const awaitParams = { max: 1 };
    if (responseWaitTime) {
      awaitParams.time = responseWaitTime;
      awaitParams.errors = ["time"];
    }

    const messageFilter = (response) => response.author.id == author.id;
    const reactionFilter = (reaction, user) =>
      (chooseFrom.includes(reaction.emoji.id) ||
        chooseFrom.includes(reaction.emoji.name)) &&
      user.id == author.id;

    switch (type) {
      case "message":
        return msg.channel
          .awaitMessages(filter || messageFilter, awaitParams)
          .then((collected) => {
            if (deleteOnResponse) msg.delete();
            if (removeResponses) collected.first().delete();
            enumHelper.waitingOnResponse.clear(author.id);
            return collected.first().content;
          })
          .catch((error) => {
            if (deleteOnResponse) msg.delete();
            enumHelper.waitingOnResponse.clear(author.id);
            console.error(error);
          });
      case "reaction":
        if (!Array.isArray(chooseFrom)) {
          if (typeof chooseFrom == "object") {
            chooseFrom = Object.keys(chooseFrom);
          } else return;
        }
        if (reactToMessage)
          for (let choice of chooseFrom)
            await msg.react(emojis[choice] || choice);

        return msg
          .awaitReactions(filter || reactionFilter, awaitParams)
          .then((collected) => {
            if (deleteOnResponse) msg.delete();
            if (removeAllReactions) {
              msg.reactions.removeAll().catch(console.error);
            } else if (removeResponses) {
              msg.reactions
                .resolve(
                  collected.first().emoji.id
                    ? collected.first().emoji.id
                    : collected.first().emoji.name
                )
                .users.remove(author.id);
            }
            enumHelper.waitingOnResponse.clear(author.id);
            return collected.first().emoji.name;
          })
          .catch((error) => {
            if (deleteOnResponse) msg.delete();
            enumHelper.waitingOnResponse.clear(author.id);
            console.error(error);
          });
    }
  }
}

module.exports = Discord;
