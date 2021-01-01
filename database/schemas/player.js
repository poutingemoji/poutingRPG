//BASE
import { Schema } from "mongoose";
import { Parser } from "expr-eval";

//DATA
import { newEquipmentObj } from "./equipment";
import { newCharacterObj } from "./character";

//UTILS
import { expFormulas } from "../../utils/enumHelper";

const playerSchema = Schema({
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
    default: [
      newEquipmentObj("needle", 30),
      newEquipmentObj("armorInventory", 20),
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

export default { playerSchema, newPlayerObj };
