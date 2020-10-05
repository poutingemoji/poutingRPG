require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");

const { paginate } = require("../../utils/helpers/arrHelper");
const { buildEmbeds } = require("../../utils/helpers/msgHelper");

const Items = require("../../docs/data/Items");

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "inventory",
      aliases: ["inv"],
      group: "game",
      memberName: "inventory",
      description: "Claim your daily reward.",
      examples: [`${client.commandPrefix}daily`],
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

    var { maxPage } = paginate(inventory);
    for (var page = 0; page < maxPage; page++) {
      var { items } = paginate(inventory, page + 1);
      var description = "";
      for (var i = 0; i < items.length; i++) {
        const id = inventory[i]
        switch(Items[id].type) {
          case "weapon": 
            description += `x${player.inventory[id]} **${Items[id].name}** | Base ATK: ${Items[id].Base_ATK} | Secondary Stat: ${Items[id].Secondary_Stat.replace(/_/g, " ")} | [ID: ${id}](https://www.twitch.tv/pokimane)\n`;            break;
          default:
            
        }
        
      }
      embeds.push(
        new MessageEmbed()
        .setTitle(`[Page ${page + 1}/${maxPage}]`)
        .setDescription(description)
      );
    }

    buildEmbeds(
      msg,
      embeds
    );
  }
};
