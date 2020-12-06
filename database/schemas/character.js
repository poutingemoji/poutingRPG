const Parser = require("expr-eval").Parser;
const enumHelper = require("../../utils/enumHelper");
const characters = require("../../data/characters");

function newCharacterObj(characterId) {
  return {
    level: {
      current: 1,
      total: 20,
    },
    //prettier-ignore
    exp: {
      current: 0,
      total: Parser.evaluate(enumHelper.expFormulas["mediumSlow"], { n: 2 }),
    },
    weapon: { id: characters[characterId].weapon, level: 1 },
    offhand: { id: characters[characterId].offhand, level: 1 },
  };
}

module.exports = { newCharacterObj };
