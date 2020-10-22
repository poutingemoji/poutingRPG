//BASE
const { Command } = require("discord.js-commando");

//DATA
const items = require("../../pouting-rpg/data/items");

// UTILS
const { Game, Discord } = require("../../DiscordBot");
const Helper = require("../../utils/Helper");

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "storage",
      memberName: "inventory",
      description: "View your inventory.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const inventoryOwned = Array.from(player.inventory.keys());

    const formatFilter = (itemName) => {
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
      formatFilter,
      inventoryOwned
    );
  }
};
