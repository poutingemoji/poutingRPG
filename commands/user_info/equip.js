//BASE
const Command = require("../../Base/Command");

module.exports = class EquipCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "equip",
      group: "user_info",
      memberName: "equip",
      description: "Equip an item.",
      args: [
        {
          key: "characterId",
          prompt: `What character do you want to equip?`,
          type: "string",
        },
        {
          key: "itemId",
          prompt: `What item do you want to equip?`,
          type: "integer",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { characterId, itemId }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;
    this.Game.equip(player, characterId, itemId);
  }
};
