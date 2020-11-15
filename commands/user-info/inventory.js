//BASE
const Command = require("../../Base/Command");

//DATA
const items = require("../../pouting-rpg/data/items");

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "user-info",
      memberName: "inventory",
      description: "View your inventory.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    const inventoryOwned = Array.from(player.inventory.keys());

    const formatFilter = (itemName) => {
      console.log(itemName)
      const itemData = items[itemName];
      switch (itemData.type) {
        case "Fish":
          return `${player.inventory.get(
            itemName
          )} **${itemName}** ${itemData.emoji} | ${
            itemData.type
          } | Rarity: ${itemData.level}`;
        case "Weapon":
          return `${player.inventory.get(itemName)} **${itemName}** | ${
            itemData.type
          } | Rarity: ${itemData.level}`;
      }
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
