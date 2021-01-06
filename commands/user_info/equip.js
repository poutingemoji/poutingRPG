//BASE
const Command = require("../../Base/Command");

//DATA
const { newEquipmentObj } = require("../../database/schemas/equipment");

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
    
    const character = player.characters.get(characterId);
    if (!character) return;
    itemId--;
    const item = this.Game.getObjectStats(player, player.equipment[itemId]);
    if (!item) return;

    this.Game.addItem(player, character[item.type]);
    this.Game.removeItem(player, itemId)
    character[item.type] = newEquipmentObj(item.id, item.level);
    this.Game.Database.savePlayer(player);
  }
};
