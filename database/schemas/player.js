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
    default: [["traveler"]],
  },
  characters: {
    type: Map,
    of: Object,
    default: {
      ["traveler"]: newCharacterObj("traveler"),
    },
  },
  equipment: {
    type: Array,
    default: [
      newEquipmentObj("dullBlade", 30),
    ],
  },
  inventory: { type: Map, of: Number, default: {} },
  progression: {
    story: {
      arc: { type: Number, default: 0 },
      chapter: { type: Number, default: 0 },
    },
    tower: {
      current: {
        floor: { type: Number, default: 0 },
        area: { type: Number, default: 0 },
      },
      total: {
        floor: { type: Number, default: 1 },
        area: { type: Number, default: 1 },
      },
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
      ["traveler"]: newCharacterObj("traveler"),
    },
    teams: [["traveler"]],
    inventory: { apple: 3, orange: 5, suspendium: 6, metalBar: 2 },
  };
}

module.exports = { playerSchema, newPlayerObj };
