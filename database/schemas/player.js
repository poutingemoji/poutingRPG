const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  playerId: String,

  family: Number,
  race: Number,
  position: Number,
  irregular: {type: Boolean, default: Math.random() >= 0.5},

  level: {type: Number, default: 1},
  exp: {type: Number, default: 0 },
  expMax: {type: Number, default: 0},

  points: {type: Number, default: 0},
  reputation: {type: Number, default: 0},

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

  arc: {type: Number, default: 0},
  chapter: {type: Number, default: 0},
  quests: {},
  weapon: {
    id: {type: Number, default: 0},
    mastery: {type: Number, default: 1},
  },
})

module.exports = playerSchema




