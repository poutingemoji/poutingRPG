//BASE
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-mongodb");

//DATA
const { newCharacter } = require("./schemas/character");
const { playerSchema, newPlayerObj } = require("./schemas/player");
const { settingSchema, newSettingObj } = require("./schemas/setting");
const enumHelper = require("../utils/enumHelper");
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

class Database {
  constructor(client) {
    this.client = client;
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

  //CHARACTER
  async addCharacter(discordId, character) {
    const player = await this.loadPlayer(discordId);
    player.characters.get(character)
      ? player.characters.get(character).constellation++
      : player.characters.set(character, newCharacter(character));
    this.savePlayer(player);
  }

  //LEADERBOARD
  loadLeaderboard(type) {
    const { where, gte = 0, sort } = enumHelper.leaderboardFilters[type];
    return Player.find().where(where).gte(gte).sort(sort).exec();
  }

  //SETTING
  async isSpawnsEnabled(channel) {
    const setting = await this.loadSetting(channel.guild.id);
    return setting.settings.spawnsEnabled.includes(channel.id)
  }

  async setSpawnsEnabled(channel) {
    console.log(channel)
    const setting = await this.loadSetting(channel.guild.id);
    if (!setting.settings.hasOwnProperty("spawnsEnabled")) {
      setting.settings.spawnsEnabled = [];
    }
    let response;
    if (setting.settings.spawnsEnabled.includes(channel.id)) {
      const index = setting.settings.spawnsEnabled.indexOf(channel.id);
      if (index > -1) {
        setting.settings.spawnsEnabled.splice(index, 1);
      }
      response = `${channel} will no longer be used for spawning regulars!`;
    } else {
      setting.settings.spawnsEnabled.push(channel.id);
      response = `${channel} will now be used for spawning regulars!`;
    }
    console.log(setting.settings.spawnsEnabled)
    this.saveSetting(setting);
    return response;
  }

  async loadSetting(guild) {
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

module.exports = Database;

/*
  Player.updateMany({  }, 
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } }, 
      { upsert: true },
      (err, res) => {
      console.log(res);
    });
*/
