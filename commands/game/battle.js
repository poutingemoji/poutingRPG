//BASE
const Battle = require("../../utils/game/Battle")
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");

module.exports = class BattleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "battle",
      group: "game",
      memberName: "battle",
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
    
    new Battle({
      player,
      target: "Test Dummy",
      Discord: this.Discord,
      Game: this.Game,
      msg
    })
    return 
  }
};
