const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const playerSchema = require('./schemas/player');

const enumHelper = require('../utils/enumHelper')
const Helper = require('../utils/Helper')
const Objects = require('./Objects');

const pets = require('../docs/data/pets.js');

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
        res.expMax = Parser.evaluate(enumHelper.expFormulas['mediumslow'], { n: res.level+1 })
      }
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

  async updatePetNeeds(playerId, differences) {
    return await Player.findOne({ playerId: playerId }, (err, res) => { 
      const needs =  enumHelper.petNeeds
      for (var i in differences) res.pet[needs[i]] = Helper.clamp(res.pet[needs[i]] += differences[i], 0, 100)
      res.pet.updatedAt = new Date();
      res.save().catch(err => console.log(err))
    }).exec();
  }

  renamePet(playerId, nickname) {
    Player.findOne({ playerId: playerId }, (err, res) => { 
      res.pet.nickname = nickname;
      res.save().catch(err => console.log(err))
    });
  }

  removePet(playerId) {
    Player.findOne({ playerId: playerId }, (err, res) => { 
      res.pet = {};
      res.save().catch(err => console.log(err))
    });
  }

  addExpPet(playerId, value) {
    Player.findOne({ playerId: playerId }, (err, res) => { 
      res.pet.exp += value
      while (res.pet.exp >= res.pet.expMax) {
        res.pet.level++
        res.pet.exp -= res.pet.expMax
        res.pet.expMax = Parser.evaluate(enumHelper.expFormulas[pets[res.pet.id].exprate], { n: res.pet.level+1 })
      }
      res.save().catch(err => console.log(err))
    });
  }
}

module.exports = new Database();