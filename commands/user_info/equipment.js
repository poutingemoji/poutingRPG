//BASE
const Command = require("../../Base/Command");

//DATA
const characters = require("../../data/characters");
const items = require("../../data/items");
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
      console.log(item)
      return `${i + 1}) ${this.Discord.emoji(item.emoji)} (Lv. ${item.level}) ${item.name} +${
        item.baseStats.hasOwnProperty("ATK")
          ? `${item.baseStats.ATK} 🗡️`
          : `${item.baseStats.HP} ❤️`
      }`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Equipment",
        globalNumbering: true,
      },
      formatFilter,
      this.groupBy(player.equipment, (data) => items[data.id].type)
    );
  }
};
