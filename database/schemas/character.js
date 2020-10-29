//BASE
const Parser = require("expr-eval").Parser;

//DATA
const characters = require("../../pouting-rpg/data/characters");

//UTILS
const enumHelper = require("../../utils/enumHelper");

const newCharacter = (character, position) => {
  return {
    position: position,
    level: {
      current: 1,
      total: 20,
    },
    exp: {
      current: 0,
      total: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }),
    },
    constellation: 0,
    HP: {
      current: characters[character].baseStats.HP,
      total: characters[character].baseStats.HP,
    },
    updatedAt: Date.now(),
  };
};

module.exports = { newCharacter };
