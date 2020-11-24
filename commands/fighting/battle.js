//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../poutingRPG/data/arcs");
const floors = require("../../poutingRPG/data/floors");
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
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    let totalEnemies = [];
    const chapter = arcs[player.story.arc].chapters[player.story.chapter];
    floors[player.floor.current - 1][chapter.area].map((wave) => {
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
