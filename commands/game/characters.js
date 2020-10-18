//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
require("dotenv").config();

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
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
    this.Discord = Game.Discord;
    this.Pagination = new Pagination();
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    const charactersOwned = Object.keys(player.characters);

    const embeds = [];

    let { maxPage } = this.Pagination.paginate(charactersOwned);
    for (let page = 0; page < maxPage; page++) {
      let { items } = this.Pagination.paginate(charactersOwned, page + 1);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        const id = charactersOwned[i];
        //const [name, position, level, duplicates]
        description += `**${name}** ${positions[position]} | Level: ${level} | Duplicates: ${duplicates} | [ID: ${id}](https://www.twitch.tv/pokimane)`;
      }
      embeds.push(
        new MessageEmbed()
          .setTitle(`[Page ${page + 1}/${maxPage}]`)
          .setDescription(description)
      );
    }

    buildEmbeds(msg, embeds);
  }
};
