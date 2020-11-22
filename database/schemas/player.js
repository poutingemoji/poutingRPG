//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//DATA
const { newCharacterObj } = require("./character");

//UTILS
const enumHelper = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  faction: String,
  position: String,
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
    total: { type: Number, default: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }) },
  },
  points: { type: Number, default: 0 },
  suspendium: { type: Number, default: 0 },
  energy: {
    current: { type: Number, default: 120 },
    total: { type: Number, default: 120 },
  },
  selectedTeam: { type: Number, default: 0 },
  teams: { type: Array, of: Array, default: [["Irregular"]] },
  characters: { type: Map, of: Object, default: {["Irregular"]: newCharacterObj()} },
  inventory: { type: Map, of: Number },
  story: {
    chapter: { type: Number, default: 0 },
    arc: { type: Number, default: 0 },
  },
  storyQuests: { type: Array, default: [] },
  dailyQuests: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now() },
});

function newPlayerObj(discordId, factionName, positionName) {
  return {
    discordId: discordId,
    faction: factionName,
    position: positionName,
    characters: ["Irregular", "Rachel", "Ship Leesoo", "Serena Rinnen"],
    teams: [["Irregular"]],
    inventory: { ["Baby Zygaena"]: 6, ["Crystal Shard"]: 4 },
  };
}

module.exports = { playerSchema, newPlayerObj };
