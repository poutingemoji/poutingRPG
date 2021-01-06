//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const floors = require("../../data/floors");

//UTILS
const PVEBattle = require("../../utils/game/PVEBattle");
const enumHelper = require("../../utils/enumHelper");
const { fillArray } = require("../../utils/Helper");

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
    const curTowerProgression = player.progression.tower.current;
    const curTowerArea =
      floors[curTowerProgression.floor].areas[curTowerProgression.area];
    new PVEBattle({
      msg,
      player,
      Discord: this.Discord,
      Game: this.Game,
      title: curTowerArea.name,
      totalWaves: curTowerArea.waves.map((wave) => {
        console.log(wave);
        const enemiesInWave = [];
        Object.keys(wave).map((enemyId) =>
          fillArray(enemyId, wave[enemyId], enemiesInWave)
        );
        return enemiesInWave;
      }),
    });
    return;
  }
};
