const mongoose = require('mongoose')

const UserstatSchema = mongoose.Schema({
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

module.exports = mongoose.model('Userstat', UserstatSchema)

