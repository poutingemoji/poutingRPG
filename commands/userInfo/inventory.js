//BASE
const Command = require("../../Base/Command");

//DATA
const items = require("../../data/items");

//UTILS
const enumHelper = require("../../utils/enumHelper");
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
    if (
      category &&
      !Object.keys(enumHelper.inventoryCategories).includes(category)
    )
      return;

    const inventory = {};
    const inventoryFiltered = category
      ? Array.from(player.inventory.keys()).filter((itemId) =>
          enumHelper.inventoryCategories[category].includes(items[itemId].type)
        )
      : Array.from(player.inventory.keys());

    Object.keys(enumHelper.inventoryCategories).map((category) => {
      inventory[category] = inventoryFiltered.filter((itemId) =>
        enumHelper.inventoryCategories[category].includes(items[itemId].type)
      );
    });
    for (let category in inventory)
      if (inventory[category].length == 0) delete inventory[category];
    console.log(inventory);
    const formatFilter = (itemId) => {
      console.log(itemId);
      const item = items[itemId];
      //prettier-ignore
      return `${player.inventory.get(itemId)} **${item.name}** ${this.Discord.emoji(item.emoji)} | ${item.type}`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Inventory",
      },
      formatFilter,
      inventory
    );
  }
};
