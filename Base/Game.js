//BASE
const gacha = require("gacha")

//DATA

//UTILS
const enumHelper = require("../utils/enumHelper");

class Game {
  roguelike(items, level, itemFilter) {
    const equip = gacha.roguelike(items, itemFilter);

    // Which item should we spawn on level 3?
    const lvl = equip[level];
    const strata = Math.random() * lvl.total;
     
    for (let i = 0; i < lvl.strata.length; i++) {
      if (strata <= lvl.strata[i]) {
        const id = lvl.lookup[i];
        return id;
      }
    }
  }
}

module.exports = Game;
