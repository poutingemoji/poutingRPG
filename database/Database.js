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

var Parser = require('expr-eval').Parser;

const formulas = {
  'fast': 'floor(((4*n)^3)/5)',
  'mediumfast': 'floor(n^3)',
  'mediumslow': 'floor((6/5*n^3)-(15*n^2)+(100*n)-140)',
  'slow': 'floor(((5*n)^3)/4)'
}

class Database {
  constructor() {
    connect();
  }

  async addExp(playerId, value) {
    Player.findOne({ playerId: playerId }, (err, res) => { 
      res.exp += value
      while (res.exp >= res.expMax) {
        res.level++
        res.exp -= res.expMax
        res.expMax = Parser.evaluate(formulas['mediumslow'], { n: res.level })
      }
      console.log(res.exp)
      console.log(res.expMax)
      res.save().catch(err => console.log(err))
    });
  }

  findPlayer(playerId) {
    return new Promise((resolve, reject) => Player.findOne({ playerId: playerId }, (err, res) => {
      if (err) {
      return reject(err);
      }

      return resolve(res);
    }));
  }

  createNewPlayer(playerId, family, race, position) {
    return new Promise((resolve, reject) => Player.replaceOne({ playerId: playerId },
    newPlayerObj(playerId, family, race, position),
    { upsert: true },
    (err, res) => {
      if (err) {
      return reject(err);
      }

      return resolve(res);
    })
  )};

  loadTop10(type) {
    return Player.find()
      .sort(type)
      .limit(10)
      .exec()
  }

}

module.exports = new Database();