// BASE
const BaseDiscord = require("../Base/Discord");
const BaseGame = require("../Base/Game");

// DATA
const { newQuest } = require("../database/schemas/quest");
const characters = require("../pouting-rpg/data/characters");
const emojis = require("../pouting-rpg/data/emojis");

// UTILS
const Database = require("../database/Database");
const Battle = require("../utils/game/Battle");
const enumHelper = require("../utils/enumHelper");
const Helper = require("../utils/Helper");

class Game extends BaseGame {
  constructor(client) {
    super();
    this.client = client;
    this.Database = new Database(this.client);
  }
}

module.exports = Game;
