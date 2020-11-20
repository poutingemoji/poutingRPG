// BASE
const BaseGame = require("../Base/Game");

// DATA
const characters = require("../pouting-rpg/data/characters");
const emojis = require("../pouting-rpg/data/emojis");
const items = require("../pouting-rpg/data/items");

// UTILS
const Database = require("../database/Database");
const PVEBattle = require("../utils/game/PVEBattle");
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
        this.Database.addItem(player, reward, obj[reward]);
      } else if (["points", "dallars", "suspendium"].includes(reward)) {
        this.Database.addValueToPlayer(player, reward, obj[reward]);
      }
    }
  }
}

module.exports = Game;
