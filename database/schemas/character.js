const Parser = require("expr-eval").Parser;
const enumHelper = require("../../utils/enumHelper");
const characters = require("../../data/characters");

function newCharacterObj(characterId) {
  return {
    level: {
      current: { type: Number, default: 1 },
      total: { type: Number, default: 25 },
    },
    //prettier-ignore
    exp: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: Parser.evaluate(enumHelper.expFormulas["mediumSlow"], { n: 2 }) },
    },
    weapon: characters[characterId].weapon,
    offHand: characters[characterId].offhand,
  };
}

module.exports = { newCharacterObj };
