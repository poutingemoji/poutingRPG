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
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    let totalEnemies = [];
    const chapter =
      arcs[player.progression.story.arc].chapters[
        player.progression.story.chapter
      ];
    floors[player.floor.current].areas[chapter.area].waves.map((wave) => {
      let enemiesInWave = [];
      for (const enemyId in wave)
        this.fillArray(
          enumHelper.getBattleStats(enemyId),
          wave[enemyId],
          enemiesInWave
        );
      totalEnemies.push(enemiesInWave);
    });

    new PVEBattle({
      player,
      Discord: this.Discord,
      Game: this.Game,
      msg,
      totalEnemies: totalEnemies,
    });
    return;

    const defeatQuest = this.Game.findQuestType(player, "Defeat");
  }
};
