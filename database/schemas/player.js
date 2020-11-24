//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//DATA
const { newCharacterObj } = require("./character");

//UTILS
const enumHelper = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  factionId: String,
  positionId: String,
  //prettier-ignore
  floor: {
    current: { type: Number, default: 1 },
    total: { type: Number, default: 1 },
  },
  adventureRank: {
    current: { type: Number, default: 1 },
    total: { type: Number, default: 25 },
  },
  //prettier-ignore
  exp: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: Parser.evaluate(enumHelper.expFormulas["mediumSlow"], { n: 2 }) },
  },
  points: { type: Number, default: 0 },
  poutingems: { type: Number, default: 0 },
  energy: {
    current: { type: Number, default: 120 },
    total: { type: Number, default: 120 },
  },
  selectedTeam: { type: Number, default: 0 },
  teams: { type: Array, of: Array, default: [["irregular"]] },
  characters: {
    type: Map,
    of: Object,
    default: { ["irregular"]: newCharacterObj() },
  },
  inventory: { type: Map, of: Number, default: {} },
  story: {
    chapter: { type: Number, default: 0 },
    arc: { type: Number, default: 0 },
  },
  storyQuests: { type: Array, default: [] },
  dailyQuests: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now() },
});

function newPlayerObj(discordId, factionId, positionId) {
  return {
    discordId,
    factionId,
    positionId,
    characters: ["irregular", "twentyFifthBaam", "khunAgueroAgnis", "rakWraithraiser", "shipLeesoo"],
    teams: [["irregular"]],
    inventory: { butterflyWings: 3, frog: 5, hook: 1 },
  };
}

module.exports = { playerSchema, newPlayerObj };
