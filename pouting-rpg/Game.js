// BASE
const BaseDiscord = require("../Base/Discord");
const BaseGame = require("../Base/Game");

// DATA
const { newQuest } = require("../database/schemas/quest");
const characters = require("../pouting-rpg/data/characters");
const emojis = require("../pouting-rpg/data/emojis");

// UTILS
const Database = require("../database/Database");
const enumHelper = require("../utils/enumHelper");
const Helper = require("../utils/Helper");

class Game extends BaseGame {
  constructor(client) {
    super();
    this.client = client;
    this.Database = new Database(this.client);
  }

  async findPlayer(user, msg) {
    const res = await this.Database.loadPlayer(user.id);
    if (!res) {
      if (msg) {
        msg.reply(msg.author.id == user.id
          ? `Please type \`${msg.guild.commandPrefix}start\` to begin.`
          : `${user.username} hasn't started climbing the Tower.`)
      }
      return false;
    }
    return res;
  }
  

}

module.exports = Game;
