//BASE
const { Command } = require("discord.js-commando");

//DATA
const items = require("../../pouting-rpg/data/items");

// UTILS
const { Game, Discord } = require("../../DiscordBot");
const enumHelper = require("../../utils/enumHelper");
const Helper = require("../../utils/Helper");

module.exports = class FishCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fish",
      group: "game",
      memberName: "fish",
      description: "Do your fishing.",
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
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;
   
    const itemFilter = (item) => {
      return item.type == "Fish";
    };
    const fish = this.Game.roguelike(items, 10, itemFilter)
    this.Game.Database.addItem(msg.author.id, fish);
    msg.reply(`You fished out: **${fish} ${this.Discord.emoji(fish)}** !`);
  }
};
