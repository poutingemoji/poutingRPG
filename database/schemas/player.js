//BASE
const mongoose = require("mongoose");
const Parser = require("expr-eval").Parser;

//DATA
const enumHelper = require("../../utils/enumHelper");

const playerSchema = mongoose.Schema({
  discordId: String,
  faction: String,
  level: {
    type: Number,
    default: 1,
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
  suspendium: {
    type: Number,
    default: 0,
  },
  battleEnergy: {
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 120,
    },
  },
  characters: {
    type: Map,
    of: Object,
    default: {},
  },
  titles: {
    current: {
      type: String,
      default: "None",
    },
    unlocked: {
      type: Array,
      default: [],
    },
  },
  events: {
    type: Array,
    default: [],
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
  fishes: {
    type: Map,
    of: Number,
    default: {},
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

const newPlayerObj = (discordId, faction) => {
  console.log(faction)
  return {
    discordId: discordId,
    faction: faction,
  }
};

module.exports = { playerSchema, newPlayerObj };
