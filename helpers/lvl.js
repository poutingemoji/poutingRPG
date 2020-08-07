const { Parser } = require('expr-eval')
const UserSchema = require('../models/userschema')
require('dotenv').config()

const funcs = {
    addExp(userId, addExp) {
        UserSchema.findOne({
			userId: userId,
		}, (err, USER) => {
            if (err) console.log(err)
            if (!USER) return
            USER.exp += addExp
            USER.level = Parser.evaluate(process.env.EXP_TO_LEVEL, { n: USER.exp })
			USER.save().catch(err => console.log(err))
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