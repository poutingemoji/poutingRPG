//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//UTILS
const enumHelper = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  faction: String,
  position: String,
  level: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 25,
    },
  },
  exp: {
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: Parser.evaluate(enumHelper.expFormulas["medium_slow"], { n: 2 }),
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  dallars: {
    type: Number,
    default: 0,
  },
  suspendium: {
    type: Number,
    default: 0,
  },
  battleEnergy: {
    current: {
      type: Number,
      default: 120,
    },
    total: {
      type: Number,
      default: 120,
    },
  },
  selectedTeam: {
    type: Number,
    default: 0,
  },
  teams: {
    type: Array,
    of: Array,
  },
  characters: Array,
  inventory: {
    type: Map,
    of: Number,
  },
  gambles: {
    type: Number,
    default: 0,
  },
  kills: {
    mob: {
      type: Number,
      default: 0,
    },
    player: {
      type: Number,
      default: 0,
    },
  },
  battles: {
    won: {
      type: Number,
      default: 0,
    },
    lost: {
      type: Number,
      default: 0,
    },
  },
  fled: {
    mob: {
      type: Number,
      default: 0,
    },
    player: {
      type: Number,
      default: 0,
    },
  },
  deaths: {
    mob: Number,
    player: Number,
    firstDeath: {
      type: String,
      default: "never",
    },
  },
  events: {
    type: Array,
    default: [],
  },
  story: {
    chapter: {
      type: Number,
      default: 0,
    },
    arc: {
      type: Number,
      default: 0,
    },
  },
  storyQuests: {
    type: Array,
    default: [],
  },
  dailyQuests: {
    type: Array,
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
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
