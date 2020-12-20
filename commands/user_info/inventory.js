//BASE
const Command = require("../../Base/Command");

//DATA
const emojis = require("../../data/emojis")
const items = require("../../data/items");

//UTILS
const { itemCategories } = require("../../utils/enumHelper");
module.exports = class InventoryCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "user_info",
      memberName: "inventory",
      description: "View your inventory.",
      args: [
        {
          key: "category",
          prompt: `What category would you like to sort by?`,
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { category }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;
    if (category && !Object.keys(itemCategories).includes(category)) return;

    const formatFilter = (itemId) => {
      const item = items[itemId];
      return `${emojis.rarities[item.level-1]} ${player.inventory.get(itemId)} **${
        item.name
      }** ${this.Discord.emoji(item.emoji)} | ${item.type}`;
    };

    const itemIds = Array.from(player.inventory.keys());
    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Inventory",
      },
      formatFilter,
      category
        ? {  
            [category]: itemIds.filter((itemId) =>
              itemCategories[category].includes(items[itemId].type)
            ),
          }
        : this.groupBy(itemIds, (itemId) => {
            return Object.keys(itemCategories).find((category) =>
              itemCategories[category].includes(items[itemId].type)
            );
          })
    );
  }
};
