//BASE
const gacha = require("gacha");

//DATA

//UTILS
const enumHelper = require("../utils/enumHelper");

class Game {
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
    for (let i = 0; i < player.storyQuests.length; i++) {
      if (player.storyQuests[i].type == type) {
        if (id && player.storyQuests[i].questId == id) {
          return player.storyQuests[i];
        } else if (!id) {
          return player.storyQuests[i];
        }
      }
    }
    return false
  }
}

module.exports = Game;
