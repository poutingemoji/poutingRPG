//BASE
const BaseCommand = require("discord.js-commando").Command;
const BaseGame = require("./Game");
const BaseHelper = require("./Helper");
const { aggregation } = require("./Util");

//DATA

//UTILS
const enumHelper = require("../utils/enumHelper");
const { Discord, Game } = require("../DiscordBot");

class Command extends aggregation(BaseCommand, BaseGame, BaseHelper) {
  getDiscord() {
    return Discord;
  }

  getGame() {
    return Game;
  }
}

module.exports = Command;