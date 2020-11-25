//BASE
const BaseCommand = require("discord.js-commando").Command;
const BaseGame = require("./Game");
const BaseHelper = require("./Helper");
const { aggregation } = require("./Util");

//UTILS
const enumHelper = require("../utils/enumHelper");
const { Discord, Game } = require("../DiscordBot");
const BaseDiscord = require("./Discord");

class Command extends aggregation(BaseCommand, BaseHelper) {
  constructor(client, commandInfo) {
    super(client, commandInfo);
    this.Discord = Discord;
    this.Game = Game;
  }
}

module.exports = Command;
