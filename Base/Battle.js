//DATA
const characters = require("../data/characters");
const enemies = require("../data/enemies");

//UTILS
const enumHelper = require("../utils/enumHelper");

class Battle {
  constructor(params) {
    const { player, msg, Discord, Game, team } = params;
    this.player = player;
    this.msg = msg;
    this.Discord = Discord;
    this.Game = Game;
    this.team = team;
    
    this.rewards = {};

    this.body = "";
    this.maxLength = 400;
  }
}

module.exports = Battle;
