const mongoose = require('mongoose')

module.exports = {
    init: () => {
        const dbOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
        }

        mongoose.connect(`mongodb+srv://poutingemoji:ILive4God@cluster0-gm8vk.mongodb.net/user-database`, dbOptions)
        mongoose.set('useFindAndModify', false)
        mongoose.Promise = global.Promise

        mongoose.connection.on('connected', () => {
            console.log('Mongoose has succesfully connected')
        })

        mongoose.connection.on('err', err => {
            console.log(`Mongoose connection error: \n${err.stack}`)
        })

        mongoose.connection.on('disconnected', err => {
            console.log(`Mongoose connection lost`)
        })
    }
}