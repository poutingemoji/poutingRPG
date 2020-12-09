//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../data/arcs");
const floors = require("../../data/floors");
//UTILS
const PVEBattle = require("../../utils/game/PVEBattle");
const enumHelper = require("../../utils/enumHelper");

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

    let totalWaves = [];
    floors[player.progression.tower.floor].areas[
      player.progression.tower.area
    ].waves.map((wave) => {
      let enemiesInWave = [];
      for (const enemyId in wave) {
        this.fillArray(
          this.Game.getBattleData(player, enemyId),
          wave[enemyId],
          enemiesInWave
        );
      }
      totalWaves.push(enemiesInWave);
    });
    const team = Object.values(player.teams[player.teamId]).map((t) =>
      this.Game.getBattleData(player, t)
    );
    new PVEBattle({
      msg,
      player,
      team,
      totalWaves: totalWaves,
      Discord: this.Discord,
      Game: this.Game,
    });
    return;
  }
};
