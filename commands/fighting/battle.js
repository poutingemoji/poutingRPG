//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//UTILS
const PVEBattle = require("../../utils/game/PVEBattle");
const enumHelper = require("../../utils/enumHelper");
const enemies = require("../../data/enemies");

module.exports = class BattleCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "battle",
      group: "fighting",
      memberName: "battle",
      description: "Battle enemies.",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    new PVEBattle({
      msg,
      player,
      Discord: this.Discord,
      Game: this.Game,
    });
    return;
  }
};
