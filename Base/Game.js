//BASE
const BaseGame = require("../Base/Game");
const gacha = require("gacha");

//DATA
const characters = require("../data/characters");
const emojis = require("../data/emojis");
const items = require("../data/items");

// UTILS
const Database = require("../database/Database");
const PVEBattle = require("../utils/game/PVEBattle");
const enumHelper = require("../utils/enumHelper");

class Game {
  constructor(client) {
    this.Database = new Database(client);
  }

  roguelike(items, level, itemFilter) {
    const equip = gacha.roguelike(items, itemFilter);

    // Which item should we spawn on level {n}?
    const lvl = equip[level];
    const strata = Math.random() * lvl.total;

    for (let i = 0; i < lvl.strata.length; i++) {
      if (strata <= lvl.strata[i]) {
        const id = lvl.lookup[i];
        return id;
      }
    }
  }

  findQuestType(player, type, id) {
    for (let i = 0; i < player.quests.story.length; i++) {
      if (player.quests.story[i].type == type) {
        if (id && player.quests.story[i].questId == id) {
          return player.quests.story[i];
        } else if (!id) {
          return player.quests.story[i];
        }
      }
    }
    return false;
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
