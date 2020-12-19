//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//UTILS
const PVEBattle = require("../../utils/game/PVEBattle");
const enumHelper = require("../../utils/enumHelper");
const floors = require("../../data/floors");

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
    const towerProgression = player.progression.tower;
    new PVEBattle({
      msg,
      player,
      Discord: this.Discord,
      Game: this.Game,
      totalWaves: floors[towerProgression.floor].areas[towerProgression.area].waves.map(
        (wave) => {
          console.log(wave)
          const enemiesInWave = [];
          Object.keys(wave).map(enemyId => this.fillArray(
            enemyId,
            wave[enemyId],
            enemiesInWave
          ))
          return enemiesInWave;
        }
      ),
    });
    return;
  }
};
