const mongoose = require('mongoose')
const Parser = require('expr-eval').Parser;

const playerSchema = new mongoose.Schema({
  playerId: String,

  family: Number,
  race: Number,
  irregular: Boolean,

  position: [Number],

  level: Number,
  exp: Number,
  expMax: Number,

  health: Number,
  shinsu: Number,
  
  quality: [Number],
  baang: Number,
  myun: Number,
  soo: Number,

  points: Number,
  dallars: Number,
  
  arc: Number,
  chapter: Number,
  technique: {
    id: Number,
    mastery: Number,
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

  reputation: Number,
  quests: [Map],
  fishes: {
    type: Map,
    of: Number,
  }
})

module.exports = playerSchema




