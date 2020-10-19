//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA

// UTILS
const { Game } = require("../../DiscordBot");
const Pagination = require("../../utils/discord/Pagination");

module.exports = class CharactersCommand extends aggregation(
  Command,
  BaseHelper
) {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: ["chars"],
      group: "game",
      memberName: "characters",
      description: "View your characters.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = Game.Discord;
    this.Pagination = new Pagination();
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    const charactersOwned = Array.from(player.characters.keys());

    const embeds = [];

    let { maxPage } = this.Pagination.paginate(charactersOwned);
    for (let page = 0; page < maxPage; page++) {
      let { items } = this.Pagination.paginate(charactersOwned, page + 1);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        const characterName = charactersOwned[i];
        const {
          name,
          positionName,
          level,
          constellation,
        } = await this.Game.getCharacterProps(characterName, player);
        description += `**${name}** ${this.Discord.emoji(
          positionName
        )} | Level: ${level} | ${constellation}\n`;
      }
      embeds.push(
        new MessageEmbed()
          .setDescription(description)
          .setFooter(`Page ${page + 1}/${maxPage}`)
      );
    }

    this.Pagination.buildEmbeds({
      title: "Characters",
      author: msg.author,
      embeds,
      msg,
    });
  }
};

