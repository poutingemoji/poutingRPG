const Parser = require("expr-eval").Parser;
const { expFormulas } = require("../../utils/enumHelper");
const characters = require("../../data/characters");
const { newEquipmentObj } = require("./equipment");
const { camelCase } = require("change-case");

function newCharacterObj(characterId) {
  return {
    level: {
      current: 1,
      total: 20,
    },
    //prettier-ignore
    exp: {
      current: 0,
      total: Parser.evaluate(expFormulas["mediumSlow"], { n: 2 }),
    },
    equipment: {
      weapon: newEquipmentObj(
        camelCase(characters[characterId].equipment.weapon.name)
      ),
      offhand: newEquipmentObj(
        camelCase(characters[characterId].equipment.offhand.name)
      ),
    },
  };
}

module.exports = { newCharacterObj };
