const { Parser } = require('expr-eval')
const playerSchema = require('../database/schemas/player')
require('dotenv').config()

const funcs = {
  addExp(discordId, addExp) {
    playerSchema.findOne({
  discordId: discordId,
  }, (err, player) => {
  if (err) console.log(err)
  if (!player) return
  player.exp += addExp
  player.level = Parser.evaluate(process.env.EXP_TO_LEVEL, { n: player.exp })
  player.save().catch(err => console.log(err))
  })
  }
}

module.exports = funcs

/*
userstatSchema.virtual('addexp').set(function(addexp) {
  console.log(addexp)
  this.exp += addexp
  console.log(this.exp)
  this.level = Parser.evaluate(process.env.EXP_TO_LEVEL, {n: this.exp})
  userstatSchema.save().catch(err => console.log(err))
})

userstatSchema.virtual('levelup').set(function(levelup) {
  for (let i = 0; i < levelup; i++) {
    this.exp += Parser.evaluate(process.env.LEVEL_TO_EXP, {n: this.level + 1})
    this.level++
    }
})
*/