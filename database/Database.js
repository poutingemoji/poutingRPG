const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { playerSchema, newPlayerObj } = require('./schemas/player');

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

  findPlayer(playerId) {
  return new Promise((resolve, reject) => Player.findOne({ playerId: playerId }, (err, res) => {
    if (err) {
    return reject(err);
    }

    return resolve(res);
  }));
  }

  createNewPlayer(playerId, surname, race, position) {
    return new Promise((resolve, reject) => Player.replaceOne({ playerId: playerId },
    newPlayerObj(playerId, surname, race, position),
    { upsert: true },
    (err, res) => {
      if (err) {
      return reject(err);
      }

      return resolve(res);
    })
  )};

  loadTop10(type) {
    return new Player.find()
      .sort(type)
      .limit(10);
  }

}

module.exports = new Database();