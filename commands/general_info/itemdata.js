//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const items = require("../../data/items");
const talents = require("../../data/talents");

//UTILS
const { rarities } = require("../../utils/enumHelper");

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

    const item = this.Game.getObjectStats(player, player.equipment[itemId-1] || itemId);
    if (!item) return;
    const params = {
      title: `${this.Discord.emoji(item.emoji)} ${item.name} (${
        item.constructor.name
      })`,
      description: item.description || "",
      color: rarities[item.rarity - 1].hex,
    };

    switch (item.constructor.name) {
      case "Weapon":
      case "Offhand":
        params.description = stripIndents(`
          ${
            item.baseStats.hasOwnProperty("HP")
              ? `**HP**: +${item.baseStats.HP}`
              : `**ATK**: +${item.baseStats.ATK}`
          }

          ${Object.keys(item.talents)
            .map(
              (talentType) =>
                `${this.Discord.emoji(talentType)} **${
                  item.talents[talentType].name
                }**: ${item.talents[talentType].description}`
            )
            .join("\n")}
        `);
        break;
    }

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
