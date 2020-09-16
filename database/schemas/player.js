const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  playerId: String,

  family: String,
  race: String,
  irregular: Boolean,

  position: [String],

  level: Number,
  exp: Number,
  expMax: Number,

  health: Number,
  shinsu: Number,
  
  baang: Number,
  myun: Number,
  soo: Number,
  
  physical: Number,
  speed: Number,
  durability: Number,

  points: Number,
  dallars: Number,
  
  technique: {},
  arc: Number,
  chapter: Number,
  move: [String],
  pet: {
    id: String,
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
  quests: Array,
  fishes: {
    type: Map,
    of: Number,
  }
})

module.exports = playerSchema




