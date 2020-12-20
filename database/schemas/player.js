//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//DATA
const { newEquipmentObj } = require("./equipment");
const { newCharacterObj } = require("./character");

//UTILS
const { expFormulas } = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  factionId: String,
  level: {
    current: { type: Number, default: 1 },
    total: { type: Number, default: 25 },
  },
  //prettier-ignore
  exp: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: Parser.evaluate(expFormulas["player"], { n: 2 }) },
  },
  points: { type: Number, default: 0 },
  poutingems: { type: Number, default: 0 },
  energy: {
    current: { type: Number, default: 160 },
    total: { type: Number, default: 160 },
  },
  teamId: { type: Number, default: 0 },
  teams: {
    type: Array,
    of: Array,
    default: [["twentyFifthBaam"]],
  },
  characters: {
    type: Map,
    of: Object,
    default: {
      ["twentyFifthBaam"]: newCharacterObj("twentyFifthBaam"),
    },
  },
  equipment: {
    type: Array,
    default: [newEquipmentObj("needle", 30), newEquipmentObj("armorInventory", 20)],
  },
  inventory: { type: Map, of: Number, default: {} },
  progression: {
    story: {
      arc: { type: Number, default: 0 },
      chapter: { type: Number, default: 0 },
    },
    tower: {
      floor: { type: Number, default: 0 },
      area: { type: Number, default: 0 },
    },
  },
  quests: {
    story: { type: Array, default: [] },
    daily: { type: Array, default: [] },
  },
  updatedAt: { type: Date, default: Date.now() },
});

function newPlayerObj(discordId, factionId) {
  return {
    discordId,
    factionId,
    characters: {
      ["twentyFifthBaam"]: newCharacterObj("twentyFifthBaam"),
      ["khunAgueroAgnis"]: newCharacterObj("khunAgueroAgnis"),
      ["rakWraithraiser"]: newCharacterObj("rakWraithraiser"),
      ["androssiZahard"]: newCharacterObj("androssiZahard"),
      ["shipLeesoo"]: newCharacterObj("shipLeesoo"),
    },
    teams: [["twentyFifthBaam", "khunAgueroAgnis", "rakWraithraiser"]],
    inventory: { apple: 3, orange: 5, suspendium: 6, metalBar: 2 },
  };
}

module.exports = { playerSchema, newPlayerObj };
