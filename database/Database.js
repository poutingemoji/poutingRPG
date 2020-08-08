const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { playerSchema, newPlayerObj, resetPlayerObj } = require('./schemas/player');

const Player = mongoose.model('Player', playerSchema);

process.on('close', () => {
  console.log('Database disconnecting on app termination');
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
    process.exit(0);
  })};
});
  
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
  process.exit(0);
  });
});

function connect() {
  if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })};
}

function disconnect() {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
}

mongoose.connection.on('error', (err) => {
  console.error(err);
  disconnect();
});

class Database {
  constructor() {
  connect();
  }

  findPlayer(discordId) {
  return new Promise((resolve, reject) => Player.findOne({ playerId: discordId }, (err, result) => {
    if (err) {
    return reject(err);
    }

    return resolve(result);
  }));
  }

  createNewPlayer(discordId, surname, race, position) {
    return new Promise((resolve, reject) => Player.replaceOne({ playerId: discordId },
    newPlayerObj(discordId, surname, race, position),
    { upsert: true },
    (err, result) => {
      if (err) {
      return reject(err);
      }
      console.log(result);
      console.log(result._id);
      return resolve(result);
    })
    );
  }
}

module.exports = Database;