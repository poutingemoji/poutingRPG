//BASE
const Battle = require("../../utils/game/Battle")
const { Command } = require("discord.js-commando");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");

// UTILS
const { Discord, Game } = require("../../DiscordBot");
const Helper = require("../../utils/Helper");

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
    this.Discord = Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;
    
    new Battle({
      player,
      target: "Test Dummy",
      Discord: this.Discord,
      msg
    })
    return 
  }
};
