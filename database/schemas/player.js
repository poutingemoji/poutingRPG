const mongoose = require('mongoose')
const Parser = require('expr-eval').Parser;

const enumHelper = require('../../utils/enumHelper')

const playerSchema = new mongoose.Schema({
  playerId: String,

  family: Number,
  race: Number,
  position: Array,
  irregular: {type: Boolean, default: Math.random() >= 0.5},

  level: {type: Number, default: 1},
  exp: {type: Number, default: 0 },
  expMax: {type: Number, default: Parser.evaluate(enumHelper.expFormulas['mediumfast'], { n: 2 })},

  health: {type: Number, default: 0},
  shinsu: {type: Number, default: 0},
  
  baang: {type: Number, default: 0},
  myun: {type: Number, default: 0},
  soo: {type: Number, default: 0},
  shape: {type: Number},

  points: {type: Number, default: 0},
  dallars: {type: Number, default: 0},
  
  volume: {type: Number, default: 0},
  arc: {type: Number, default: 0},
  chapter: {type: Number, default: 0},
  technique: {
    id: {type: Number, default: 0},
    mastery: {type: Number, default: 1},
  },
  pet: {
    id: Number,
    updatedAt: Date,
    nickname: String,

    level: Number,
    exp: Number,
    expMax: Number,

    hunger: Number,
    hygiene: Number,
    fun: Number,
    energy: Number,
  },

  reputation: {type: Number, default: 0},
  quests: {},
})

module.exports = playerSchema




