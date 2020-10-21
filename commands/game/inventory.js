//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
const items = require("../../pouting-rpg/data/items");

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class InventoryCommand extends aggregation(
  Command,
  BaseHelper
) {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "game",
      memberName: "inventory",
      description: "View your inventory.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    const inventoryOwned = Array.from(player.inventory.keys());

    const format = (i) => {
      const itemName = inventoryOwned[i];
      const item = items[itemName];
      return `${player.inventory.get(
        itemName
      )} **${itemName}** ${this.Discord.emoji(itemName)} | Rarity: ${
        item.rarity
      }`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        title: "Inventory",
        author: msg.author,
        msg,
      },
      format,
      inventoryOwned
    );
  }
};
