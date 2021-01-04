//BASE
const BaseCommand = require("discord.js-commando").Command;
const BaseHelper = require("./Helper");
const { aggregation } = require("./Util");

//UTILS
const { Discord, Game } = require("../DiscordBot");

module.exports = class Command extends (
  aggregation(BaseCommand, BaseHelper)
) {
  constructor(client, commandInfo) {
    super(client, commandInfo);
    this.Discord = Discord;
    this.Game = Game;
  }
};
