//BASE
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

//DATA
const { newCharacter } = require("./schemas/character");
const { playerSchema, newPlayerObj } = require("./schemas/player");
const enumHelper = require("../utils/enumHelper");
require("dotenv").config();

const Player = mongoose.model("Player", playerSchema);

process.on("close", () => {
  console.log("Database disconnecting on app termination");
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  }
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

function connect() {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
}

function disconnect() {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
}

mongoose.connection.on("error", (err) => {
  console.error(err);
  disconnect();
});

connect();

class Database {
  constructor() {
    connect();
  }

  // PLAYER
  createNewPlayer(discordId, faction) {
    return new Promise((resolve, reject) =>
      Player.replaceOne(
        { discordId: discordId },
        newPlayerObj(discordId, faction),
        { upsert: true },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      )
    );
  }

  async addCharacter(discordId, character) {
    const player = await this.loadPlayer(discordId);
    player.characters.get(character)
      ? player.characters.get(character).constellation++
      : player.characters.set(character, newCharacter(character));
    this.savePlayer(player);
  }

  loadLeaderboard(type) {
    const { where, gte = 0, sort } = enumHelper.leaderboardFilters[type];
    return Player.find().where(where).gte(gte).sort(sort).exec();
  }

  async loadPlayer(discordId) {
    return new Promise((resolve, reject) =>
      Player.findOne({ discordId: discordId }, (err, res) => {
        if (err) {
          return reject(res);
        }
        return resolve(res);
      })
    );
  }

  savePlayer(player, update) {
    if (update && !update.hasOwnProperty("$unset"))
      update = Object.assign(player, update);
    Player.updateOne(
      { discordId: player.discordId },
      update || player,
      { upsert: true },
      (err, res) => {
        //console.log(res);
      }
    );
  }
}

module.exports = Database;

/*
  Player.updateMany({  }, 
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } }, 
      { upsert: true },
      (err, res) => {
      console.log(res);
    });
*/
