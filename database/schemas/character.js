//BASE
const Parser = require("expr-eval").Parser;

//DATA
const characters = require("../../pouting-rpg/data/characters");

//UTILS
const enumHelper = require("../../utils/enumHelper");

const newCharacter = (character) => {
  return {
    level: {
      current: 1,
      total: 20,
    },
    exp: {
      current: 0,
      total: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }),
    },
    constellation: 0,
  };
};

module.exports = { newCharacter };
