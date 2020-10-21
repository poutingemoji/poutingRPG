//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA
const items = require("../../pouting-rpg/data/items");

// UTILS
const { Game } = require("../../DiscordBot");
const enumHelper = require("../../utils/enumHelper");

//FILTERED DATA
const filter = (key) => {
  return items[key].type == "Fish";
};
const fishes = Game.filterObject(items, filter);

module.exports = class FishCommand extends aggregation(Command, BaseHelper) {
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
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    const fish = this.percentageChance(
      Object.keys(fishes),
      Object.values(fishes).map((res) => res.rarity)
    );
    //player.addItem(fish);
    msg.reply(`You fished out: **${fish} ${this.Discord.emoji(fish)}** !`);
  }
};
