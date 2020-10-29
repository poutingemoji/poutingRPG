//BASE
const Commando = require("discord.js-commando");
const BaseCommand = Commando.Command;
const { aggregation } = require("./Util");
const BaseHelper = require("./Helper");
//DATA

//UTILS
const enumHelper = require("../utils/enumHelper");
const { Discord, Game } = require("../DiscordBot");

class Command extends aggregation(BaseCommand, BaseHelper) {
  getGame() {
    return Game;
  }

  getDiscord() {
    return Discord;
  }
}

module.exports = Command;
