//BASE
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-mongodb");

//DATA
const { playerSchema, newPlayerObj } = require("./schemas/player");
const { settingSchema, newSettingObj } = require("./schemas/setting");

//UTILS
const { leaderboardFilters } = require("../utils/enumHelper");
require("dotenv").config();

const Player = mongoose.model("Player", playerSchema);
const Setting = mongoose.model("Setting", settingSchema);

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

module.exports = class Database {
  constructor(client, Game) {
    this.client = client;
    this.Game = Game;
    this.setProvider();
    connect();
  }

  setProvider() {
    this.client
      .setProvider(
        MongoClient.connect(process.env.MONGODB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }).then((client) => new MongoDBProvider(client))
      )
      .catch(console.error);
  }

  updateAllPlayers() {
    //write code noob
  }

  savePlayer(player, update) {
    if (update && !update.hasOwnProperty("$unset"))
      player = Object.assign(player, update);
    Player.updateOne(
      { discordId: player.discordId },
      player,
      { upsert: true },
      (err, res) => {
        //console.log(res);
      }
    );
  }

  loadPlayer(discordId) {
    return new Promise((resolve, reject) =>
      Player.findOne({ discordId: discordId }, (err, res) => {
        if (err) {
          return reject(res);
        }
        return resolve(res);
      })
    );
  }

  createNewPlayer(discordId, { factionId }) {
    return new Promise((resolve, reject) =>
      Player.replaceOne(
        { discordId: discordId },
        newPlayerObj(discordId, factionId),
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

  //LEADERBOARD
  loadLeaderboard(type) {
    const { where, gte = 0, sort } = leaderboardFilters[type];
    return Player.find().where(where).gte(gte).sort(sort).exec();
  }

  //SETTINGS
  createNewSetting(guild) {
    return new Promise((resolve, reject) =>
      Setting.replaceOne(
        { guild: guild },
        newSettingObj(guild),
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

  loadSetting(guild) {
    return new Promise((resolve, reject) =>
      Setting.findOne({ guild: guild }, (err, res) => {
        if (err) {
          return reject(res);
        }
        return resolve(res);
      })
    );
  }

  saveSetting(setting) {
    Setting.updateOne(
      { guild: setting.guild },
      setting,
      { upsert: true },
      (err, res) => {
        //console.log(res);
      }
    );
  }
}

/*
  Player.updateMany({  }, 
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } }, 
      { upsert: true },
      (err, res) => {
      console.log(res);
    });
*/
