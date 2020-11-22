const Parser = require("expr-eval").Parser;
const enumHelper = require("../../utils/enumHelper");

function newCharacterObj() {
  return {
    level: {
      current: { type: Number, default: 1 },
      total: { type: Number, default: 25 },
    },
    //prettier-ignore
    exp: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }) },
    },
  };
}

module.exports = { newCharacterObj };
