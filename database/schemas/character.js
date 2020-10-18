//BASE
const Parser = require("expr-eval").Parser;

//DATA
const characters = require("../../pouting-rpg/data/characters");
const enumHelper = require("../../utils/enumHelper");

const newCharacter = (character) => {
  return {
    level: 1,
    exp: {
      current: 0,
      total: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }),
    },
    constellation: 0,
    health: 100,
  };
};

module.exports = { newCharacter };
