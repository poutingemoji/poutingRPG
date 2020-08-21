const mongoose = require('mongoose')
const fs = require('fs')
const sdata = JSON.parse(fs.readFileSync('./data/surnames.json', 'utf8'))
const rdata = JSON.parse(fs.readFileSync('./data/races.json', 'utf8'))
const pdata = JSON.parse(fs.readFileSync('./data/positions.json', 'utf8'))

const playerSchema = new mongoose.Schema({
  playerId: String,
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  irregular: {
    type: Boolean,
    default: Math.random() >= 0.5
  },
  surname: String,
  race: String,
  position: String,
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

const newPlayerObj = (discordId, surname, race, position) => {
  return {
    playerId: discordId,
    surname: surname,
    race: race,
    position: position,
  }
}

playerSchema.virtual('showSurname').get(function() {
  return sdata[this.surname].name
})

playerSchema.virtual('showRace').get(function() {
  for (let c in rdata) {
    if (rdata[c][this.race]) return rdata[c][this.race].name
  }
})

playerSchema.virtual('showPosition').get(function() {
  return pdata[this.position].name
})

module.exports = { playerSchema, newPlayerObj }




