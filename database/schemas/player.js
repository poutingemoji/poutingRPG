//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//DATA
const { newCharacterObj } = require("./character");
const positions = require("../../data/positions");
//UTILS
const enumHelper = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  factionId: String,
  adventureRank: {
    current: { type: Number, default: 1 },
    total: { type: Number, default: 25 },
  },
  //prettier-ignore
  exp: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: Parser.evaluate(enumHelper.expFormulas["player"], { n: 2 }) },
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
    of: {
      waveController: { type: String, default: "none" },
      lightBearer: { type: String, default: "none" },
      spearBearer: { type: String, default: "none" },
      fisherman: { type: String, default: "none" },
      scout: { type: String, default: "none" },
    },
    default: [{ waveController: "twentyFifthBaam" }],
  },
  characters: {
    type: Map,
    of: Object,
    default: {
      ["twentyFifthBaam"]: newCharacterObj("twentyFifthBaam"),
    },
  },
  equipment: { type: Array, default: [] },
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
    teams: [
      {
        waveController: "twentyFifthBaam",
        lightBearer: "khunAgueroAgnis",
        spearBearer: "rakWraithraiser",
      },
    ],
    inventory: { butterflyWings: 3, frog: 5 },
  };
}

module.exports = { playerSchema, newPlayerObj };
