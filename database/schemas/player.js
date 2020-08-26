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
    lastUpdated: Date,
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
    tier: {type: Number, default: 1},
  },
})

const newPlayerObj = (playerId, family, race, position) => {
  return {
    playerId: playerId,
    family: family,
    race: race,
    position: position,
  }
}

const newPetObj = (id, nickname) => {
  return {
    pet: {
      id: id,
      lastUpdated: new Date(),
      nickname: nickname,

      level: 1, exp: 0, expMax: 0,
      hunger: 100, hygiene: 100, fun: 100, energy: 100,
    }
  }
}

const newWeaponObj = (id) => {
  return {
    weapon: {
      id: id,
      tier: 1,
    }
  }
}

const newQuestObj = (id) => {
  return {
    questObjectiveType: '',
    task: '',
    rewards: {
      points: 1, xp: 1,
    }
  }
}

module.exports = { playerSchema, newPlayerObj }




