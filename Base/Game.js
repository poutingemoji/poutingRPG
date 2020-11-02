//BASE
const gacha = require("gacha");

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

  checkExperience(params) {
    const { player, characterName, msg } = params;
    let obj;
    let level;
    let exp;

    if (characterName) {
      const character = player.characters.get(characterName);
      level = previousLevel = character.level;
      exp = character.exp;
    } else {
      obj = player;
      level = previousLevel = player.adventureRank;
      exp = player.adventureRankExp;
    }

    if (!(exp.current >= exp.total)) return player;

    while (exp.current >= exp.total && level.total > level.current) {
      level.current++;
      exp.current -= exp.total;
      exp.total = Parser.evaluate(
        enumHelper.expFormulas[characterName ? "player" : "character"],
        {
          n: level.current + 1,
        }
      );
    }

    if (level.current !== previousLevel.current) {
      msg.say(
        `🆙 Congratulations ${msg.author.toString()}, ${
          characterName ? `${characterName} has` : "you've"
        } reached Level **${level.current}**!\n\n`
      );
    }
    conole.log(player)
    return player;
  }s
}

module.exports = Game;
