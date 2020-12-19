//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");
const { createCanvas, loadImage } = require("canvas");

const fs = require("fs");

//DATA
const items = require("../../data/items");
const talents = require("../../data/talents");

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
          default: "needle",
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
 
    const item = this.Game.getEquipment({ id: itemId, level: 1 });
    if (!item) return;
    const params = {
      title: `${this.Discord.emoji(item.emoji)} ${item.name}`,
      description: stripIndents(`
      ${
        item.hasOwnProperty("HP")
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
        .join("\n")}`),
    };

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
