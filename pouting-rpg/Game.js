// BASE
const BaseDiscord = require("../Base/Discord");
const BaseGame = require("../Base/Game");

// DATA
const { newQuest } = require("../database/schemas/quest");
const characters = require("../pouting-rpg/data/characters");
const emojis = require("../pouting-rpg/data/emojis");
const items = require("../pouting-rpg/data/items")

// UTILS
const Database = require("../database/Database");
const Battle = require("../utils/game/Battle");
const enumHelper = require("../utils/enumHelper");

class Game extends BaseGame {
  constructor(client) {
    super();
    this.client = client;
    this.Database = new Database(this.client);
  }

  addRewards(player, obj) {
    for (const reward in obj) {
      if (items.hasOwnProperty(reward)) {
        this.Database.addItem(player, reward, obj[reward])
      } else if (["points", "dallars", "suspendium"].includes(reward)) {
        this.Database.addValuePlayer(player, reward, obj[reward])
      }
    }
  }
}

module.exports = Game;
