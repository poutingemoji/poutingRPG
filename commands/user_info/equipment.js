//BASE
const Command = require("../../Base/Command");

//DATA
const characters = require("../../data/characters");
const items = require("../../data/items");

//UTILS
const { rarities, talentTypes } = require("../../utils/enumHelper");
console.log(talentTypes)
module.exports = class EquipmentCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "equipment",
      group: "user_info",
      memberName: "equipment",
      description: "View your equipment.",
      args: [],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = (data, i) => {
      const item = this.Game.getEquipment(data);
      return `${i + 1}) ${rarities[item.rarity - 1].emoji} **${
        item.name
      }** ${this.Discord.emoji(item.emoji)} (+${
        item.baseStats.hasOwnProperty("ATK")
          ? `${item.baseStats.ATK} ATK`
          : `${item.baseStats.HP} HP`
      })`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Equipment",
        globalNumbering: true,
      },
      formatFilter,
      this.groupBy(player.equipment, (item) => items[item.id].constructor.name)
    );
  }
};
//🗡️❤️
