//BASE
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const MongoDBProvider = require("commando-mongodb");
const Parser = require("expr-eval").Parser;
const BaseGame = require("../Base/Game");
const BaseHelper = require("../Base/Helper");
const { aggregation } = require("../Base/Util");

//DATA
const { playerSchema, newPlayerObj } = require("./schemas/player");
const { settingSchema, newSettingObj } = require("./schemas/setting");
const arcs = require("../pouting-rpg/data/arcs");
const characters = require("../pouting-rpg/data/characters");
const enemies = require("../pouting-rpg/data/enemies");
const items = require("../pouting-rpg/data/items");

//UTILS
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

class Database extends aggregation(BaseHelper, BaseGame) {
  constructor(client) {
    super();
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

  async findPlayer(user, msg) {
    const res = await this.loadPlayer(user.id);
    if (!res) {
      if (msg) {
        msg.reply(
          msg.author.id == user.id
            ? `Please type \`${msg.guild.commandPrefix}start\` to begin.`
            : `${user.username} hasn't started climbing the Tower.`
        );
      }
      return false;
    }
    return res;
  }

  // PLAYER
  addExpToPlayer(player, expToAdd, msg) {
    const previousAR = player.level.current;
    player.exp.current += expToAdd;

    while (
      player.exp.current >= player.exp.total &&
      player.level.current < player.level.total
    ) {
      player.level.current++;
      player.exp.current -= player.exp.total;
      player.exp.total = Parser.evaluate(enumHelper.expFormulas["player"], {
        n: player.level.current + 1,
      });
    }

    if (player.level.current !== previousAR) {
      msg.say(
        `🆙 Congratulations ${msg.author.toString()}, you've reached Adventure Rank **${
          player.level.current
        }**!\n\n`
      );
    }
    this.savePlayer(player);
  }

  async addValueToPlayer(player, key, value) {
    player[key] += value;
    await this.addQuestProgress(player, "Earn", key, value);
    this.savePlayer(player);
  }

  createNewPlayer(discordId, { factionName, positionName }) {
    return new Promise((resolve, reject) =>
      Player.replaceOne(
        { discordId: discordId },
        newPlayerObj(discordId, factionName, positionName),
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

  addCharacter(player, characterName) {
    if (player.characters.includes(characterName)) return;
    player.characters.push(characterName);
    this.savePlayer(player);
  }

  async getCharacter(player, characterName) {
    const user = await this.client.users.fetch(player.discordId);
    const isMC = enumHelper.isMC(characterName);
    const character = characters[characterName];

    return {
      name: isMC ? user.username : characterName,
      rarity: character.level,
      positionName: isMC ? player.position : character.position,
      baseStats: character.baseStats,
    };
  }

  //TEAM
  manageTeam(player, action, teamNumber, characterName) {
    teamNumber -= 1;
    if (!this.isBetween(teamNumber, 0, enumHelper.maxTeams)) return;
    if (characterName && !player.characters.includes(characterName)) return;

    switch (action) {
      case "select":
        player.selectedTeam = teamNumber;
        break;
      case "add":
        if (player.teams[teamNumber].includes(characterName)) return;
        player.teams[teamNumber].push(characterName);
        break;
      case "remove":
        let fallbackTeam;
        if (player.teams[teamNumber].length == 1) {
          for (let i = 0; i < player.teams.length; i++) {
            if (player.teams[i].length > 0 && i !== teamNumber)
              fallbackTeam = i;
          }
          if (!fallbackTeam) return;
        }
        player.selectedTeam = fallbackTeam;
        const index = player.teams[teamNumber].indexOf(characterName);
        if (index !== -1) player.teams[teamNumber].splice(index, 1);
        break;
    }
    this.savePlayer(player);
  }

  //INVENTORY
  addItem(player, item, amount = 1) {
    player.inventory.get(item)
      ? player.inventory.set(item, player.inventory.get(item) + amount)
      : player.inventory.set(item, amount);
    this.addQuestProgress(player, "Collect", item);
    this.savePlayer(player);
  }

  removeItem(player, item, amount = 1) {
    //prettier-ignore
    player.inventory.get(item) >= 2
      ? player.inventory.set(item, player.inventory.get(item) - this.clamp(amount, 0, player.inventory.get(item)))
      : player.inventory.delete(item);
    this.savePlayer(player);
  }

  //LEADERBOARD
  loadLeaderboard(type) {
    const { where, gte = 0, sort } = enumHelper.leaderboardFilters[type];
    return Player.find().where(where).gte(gte).sort(sort).exec();
  }

  //QUEST
  addQuests(player) {
    this.savePlayer(player, {
      storyQuests: arcs[player.story.arc].chapters[player.story.chapter].quests,
    });
  }

  addQuestProgress(player, type, id, value = 1) {
    const quest = this.findQuestType(player, type, id);
    console.log(quest, id);
    if (!quest || quest.progress == quest.goal) return;
    console.log(quest, id);
    if (isNaN(value)) {
      quest.progress = value;
    } else {
      quest.progress += Math.min(value, quest.goal - quest.progress);
      console.log(quest.progress);
    }
  }

  //SETTING
  async isSpawnsEnabled(channel) {
    const setting = await this.loadSetting(channel.guild.id);
    if (!setting) return;
    return setting.settings.spawnsEnabled.includes(channel.id);
  }

  async setSpawnsEnabled(channel) {
    let setting = await this.loadSetting(channel.guild.id);
    if (!setting) {
      await this.createNewSetting(channel.guild.id);
      setting = await this.loadSetting(channel.guild.id);
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
    this.saveSetting(setting);
    return response;
  }

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

module.exports = Database;

/*
  Player.updateMany({  }, 
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } }, 
      { upsert: true },
      (err, res) => {
      console.log(res);
    });
*/
