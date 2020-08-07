const { Schema, model } = require('mongoose')
const fs = require('fs')
const sdata = JSON.parse(fs.readFileSync('./data/surnames.json', 'utf8'))
const rdata = JSON.parse(fs.readFileSync('./data/races.json', 'utf8'))
const pdata = JSON.parse(fs.readFileSync('./data/positions.json', 'utf8'))

const UserSchema = new Schema({
    userId: String,
    exp: Number,
    level: Number,
    points: Number,
    irregular: Boolean,
    surname: String,
    race: String,
    position: String,
    rank: Number,
    badges: Array,
    inventory: {
        type: Map,
        of: Number
    }
})

UserSchema.virtual('showSurname').get(function() {
    return sdata[this.surname].name
})

UserSchema.virtual('showRace').get(function() {
    for (let c in rdata) {
        if (rdata[c][this.race]) return rdata[c][this.race].name
	}
})

UserSchema.virtual('showPosition').get(function() {
    return pdata[this.position].name
})

module.exports = model('User', UserSchema)




