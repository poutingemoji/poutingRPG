//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");
const { createCanvas, loadImage } = require("canvas");

const fs = require("fs");

//DATA
const items = require("../../data/items");
const talents = require("../../data/talents");

//UTILS
const {rarities} = require("../../utils/enumHelper")

module.exports = class ItemDataCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "itemdata",
      group: "general_info",
      memberName: "itemdata",
      description: "Shows information on a item.",
      examples: [],
      args: [
        {
          key: "itemId",
          prompt: `What item would you like to get information on?`,
          type: "string",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { itemId }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const item = isNaN(itemId)
      ? items[itemId]
      : this.Game.getEquipment(player.equipment[itemId]);
    if (!item) return;
    const params = {  title: `${this.Discord.emoji(item.emoji)} ${item.name}` };

    switch (item.type) {
      case "weapon":
      case "offhand":
        params.description = stripIndents(`
          ${
            item.baseStats.hasOwnProperty("HP")
              ? `❤️ **HP**: +${item.baseStats.HP}`
              : `🗡️ **ATK**: +${item.baseStats.ATK}`
          }

          ${Object.keys(item.talents)
            .map(
              (talentType) =>
                `${this.Discord.emoji(talents[talentType].emoji)} **${
                  item.talents[talentType].name
                }**: ${item.talents[talentType].description}`
            )
            .join("\n")}
        `);
        break;
      default:
        params.description = `${item.description}`;
        params.color = rarities[item.level-1].hex
    }

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
