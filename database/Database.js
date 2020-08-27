const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const playerSchema = require('./schemas/player');

const Objects = require('./Objects');

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

const Parser = require('expr-eval').Parser;

class Database {
  constructor() {
    connect();
  }

  addExpPlayer(playerId, value) {
    Player.findOne({ playerId: playerId }, (err, res) => { 
      res.exp += value
      while (res.exp >= res.expMax) {
        res.level++
        res.exp -= res.expMax
        res.expMax = Parser.evaluate(Objects.formulas['mediumslow'], { n: res.level+1 })
      }
      console.log(res.exp)
      console.log(res.expMax)
      res.save().catch(err => console.log(err))
    });
  }

  findPlayer(message, noMessage) {
    return new Promise((resolve, reject) => Player.findOne({ playerId: message.author.id }, (err, res) => {
      if (err) {
      return reject(err);
      }
      if (!res && !noMessage) {
      return message.say(`Please type \`${message.client.commandPrefix}start\` to begin.`);
      }

      return resolve(res);
    }));
  }

  createNewPlayer(playerId, family, race, position) {
    return new Promise((resolve, reject) => Player.replaceOne({ playerId: playerId },
    Objects.newPlayer(playerId, family, race, position),
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

  createNewPet(playerId, id, nickname) {
    return new Promise((resolve, reject) => Player.updateOne({ playerId: playerId },
      Objects.newPet(id, nickname),
      { upsert: true },
      (err, res) => {
        if (err) {
        return reject(err);
        }
  
        return resolve(res);
      })
    )}
    updateMoodPet(playerId, mood) {
      Player.findOne({ playerId: playerId }, (err, res) => { 
        res.pet.hunger += mood[0]
        res.pet.hygiene += mood[1]
        res.pet.fun += mood[2]
        res.pet.energy += mood[3]
        res.save().catch(err => console.log(err))
      });
    }
}

module.exports = new Database();