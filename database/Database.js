const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const playerSchema = require('./schemas/player');

const { clamp } = require('../utils/Helper')
const { expFormulas, petNeeds } = require('../utils/enumHelper')
const { newPlayer, newPet, newTechnique } = require('./Objects');

const positions = require('../docs/data/positions.js');
const pets = require('../docs/data/pets.js');
const arcs = require('../docs/data/arcs.js');

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

  addQuestsPlayer(player) {
    return new Promise((resolve, reject) => Player.updateOne({ playerId: player.id },
      {quests: arcs[0].chapters[0].quests},
      { upsert: true },
      (err, res) => {
        if (err) {
        return reject(err);
        }
  
        return resolve(res);
      })
    )}

  createNewPlayer(player, family, race, position) {
    console.log(player.id, family, race, position)
    return new Promise((resolve, reject) => Player.replaceOne({ playerId: player.id },
    newPlayer(player.id, family, race, position),
    { upsert: true },
    (err, res) => {
      if (err) {
      return reject(err);
      }

      return resolve(res);
    })
  )};

  findPlayer(msg, player, noMessage) {
    return new Promise((resolve, reject) => Player.findOne({ playerId: player.id }, (err, res) => {
      if (err) {
      return reject(err);
      }
      if (!res && !noMessage) {
        if (msg.author.id == player.id) {
          return msg.say(`Please type \`${msg.client.commandPrefix}start\` to begin.`);
        } else {
          return msg.say(`${player.username} hasn't started climbing the Tower.`);
        }
      }

      return resolve(res);
    }));
  }

  incrementValuePlayer(player, key, value) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      console.log(key, value)
      res[key] += value
      res.save().catch(err => console.log(err))
    });
  }

  addExpPlayer(player, msg, value) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      res.exp += value
      let description = ''
      while (res.exp >= res.expMax) {
        res.level++
        res.exp -= res.expMax
        res.expMax = Parser.evaluate(expFormulas['mediumslow'], { n: res.level+1 })
        description += `🆙 Congratulations ${player.toString()}, you've reached level **${res.level}**!\n`;
      }
      if (description !== '') msg.say(description)
      res.save().catch(err => console.log(err))
    });
  }

  addFishPlayer(player, fish) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      res.fishes.set(fish, res.fishes.get(fish)+1 || 1);
      res.save().catch(err => console.log(err))
    });
  }

  loadTop10(filter) {
    return Player.find()
      .sort(filter)
      .exec()
  }

  createNewPet(player, id, nickname) {
    return new Promise((resolve, reject) => Player.updateOne({ playerId: player.id },
      newPet(id, nickname),
      { upsert: true },
      (err, res) => {
        if (err) {
        return reject(err);
        }
  
        return resolve(res);
      })
    )}

  updateNeedsPet(player, differences) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      const needs =  petNeeds
      for (var i in differences) res.pet[needs[i]] = clamp(res.pet[needs[i]] += differences[i], 0, 100)
      res.pet.updatedAt = new Date();
      res.save().catch(err => console.log(err))
    }).exec();
  }

  addExpPet(player, value) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      res.pet.exp += value
      while (res.pet.exp >= res.pet.expMax) {
        res.pet.level++
        res.pet.exp -= res.pet.expMax
        res.pet.expMax = Parser.evaluate(expFormulas[pets[res.pet.id].exprate], { n: res.pet.level+1 })
      }
      res.save().catch(err => console.log(err))
    });
  }

  renamePet(player, nickname) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      res.pet.nickname = nickname;
      res.save().catch(err => console.log(err))
    });
  }

  removePet(player) {
    Player.findOne({ playerId: player.id }, (err, res) => { 
      res.pet = {};
      res.save().catch(err => console.log(err))
    });
  }
}

module.exports = new Database();