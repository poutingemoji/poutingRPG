//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
require("dotenv").config();

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
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "filter",
          prompt: `What character would you like to get more Inventory on?`,
          type: "string",
          default: "irregular",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { filter }) {
    const player = await findPlayer(msg.author, msg);
    const inventory = Object.keys(player.inventory);

    const embeds = [];

    let { maxPage } = paginate(inventory);
    for (let page = 0; page < maxPage; page++) {
      let { items } = paginate(inventory, page + 1);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        const id = inventory[i];
        const item = Items[id];
        switch (item.type) {
          case "weapon":
            description += `x${player.inventory[id]} **${
              item.name
            }** | [${titleCase(
              item.type
            )}](https://www.twitch.tv/pokimane) | Base ATK: ${
              item.Base_ATK
            } | 2nd Stat: ${item.Secondary_Stat.replace(
              /_/g,
              " "
            )} | [ID: ${id}](https://www.twitch.tv/pokimane)\n`;
            break;
          default:
        }
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
