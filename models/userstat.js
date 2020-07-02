const mongoose = require('mongoose')

const userStatSchema = mongoose.Schema({
    userID: String,
    totalExp: Number,
    currentExp: Number,
    level: Number,
    points: Number,
    position: String,
    irregular: Boolean,
    rank: Number,
})

module.exports = mongoose.model('Userstat', userStatSchema)

