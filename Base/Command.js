//BASE
const BaseCommand = require("discord.js-commando").Command;

const { aggregation } = require("./Util");

//UTILS
const { Discord, Game } = require("../DiscordBot");
const Helper = require("../utils/Helper");

module.exports = class Command extends (
  BaseCommand
) {
  constructor(client, commandInfo) {
    super(client, commandInfo);
    this.Discord = Discord;
    this.Game = Game;
  }
};
