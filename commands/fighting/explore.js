//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");

//UTILS
const Battle = require("../../utils/game/Battle")

module.exports = class ExploreCommand extends Command {
  constructor(client) {
    super(client, {
      name: "explore",
      group: "fighting",
      memberName: "explore",
      description: "Battle enemies.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    const defeatQuest = this.Game.findQuestType(player, "Defeat")
    new Battle({
      player,
      Discord: this.Discord,
      Game: this.Game,
      msg
    })
    return 
  }
};
