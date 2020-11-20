//DATA
const characters = require("../pouting-rpg/data/characters")
const enemies = require("../pouting-rpg/data/enemies")

//UTILS
const enumHelper = require("../utils/enumHelper");

class Battle {
  constructor(params) {
    const { player, msg, Discord, Game } = params;
    this.player = player;
    this.msg = msg;
    this.Discord = Discord;
    this.Game = Game;

    this.team = this.player.teams[this.player.selectedTeam].map((t) =>
      enumHelper.getBattleStats(t)
    );
    this.rewards = {};

    this.body = "";
    this.maxLength = 400;
  }
}

module.exports = Battle;
