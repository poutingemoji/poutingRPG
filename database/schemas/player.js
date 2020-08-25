const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  playerId: String,
  level: {
    type: Number,
    default: 1
  },
  exp: {
    type: Number,
    default: 0
  },
  expMax: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0
  },
  irregular: {
    type: Boolean,
    default: Math.random() >= 0.5
  },
  surname: Number,
  race: Number,
  position: Number,
  rank: {
    type: Number,
    default: 30
  },
  badges: {
    type: Array,
    default: []
  },
  inventory: {
    type: Map,
    of: Number,
    default: {}
  },
})

const newPlayerObj = (playerId, surname, race, position) => {
  return {
    playerId: playerId,
    surname: surname,
    race: race,
    position: position,
  }
}

module.exports = { playerSchema, newPlayerObj }




