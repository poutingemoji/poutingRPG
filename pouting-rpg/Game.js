// BASE
const BaseDiscord = require("../Base/Discord");
const BaseGame = require("../Base/Game");
const BaseHelper = require("../Base/Helper");
const { aggregation } = require("../Base/Util");

// DATA
const { newQuest } = require("../database/schemas/quest");
const characters = require("../pouting-rpg/data/characters");
const emojis = require("../pouting-rpg/data/emojis");
const enumHelper = require("../utils/enumHelper");

// UTILS
const Database = require("../database/Database");
const Pagination = require("../utils/discord/Pagination");

class Game extends aggregation(BaseGame, BaseHelper) {
  constructor(client) {
    super();
    this.client = client;
    this.Discord = new BaseDiscord(client);
    this.Database = new Database(client);
    this.Pagination = new Pagination();
  }

  async findPlayer(user, msg) {
    const res = await this.Database.loadPlayer(user.id);
    const startMsg = `Please type \`${msg.client.commandPrefix}start\` to begin.`;
    if (!res) {
      if (msg) {
        return msg.author.id == user.id
          ? startMsg
          : `${user.username} hasn't started climbing the Tower.`;
      }
      return startMsg;
    }
    return res;
  }

  async getCharacterProps(characterName, player) {
    const character = player.characters.get(characterName);
    const user = await this.client.users.fetch(player.discordId);
    const isMC = enumHelper.isMC(characterName);
    return {
      attributes: characters[characterName].attributes,
      rarity: characters[characterName].rarity,
      name: isMC ? user.username : characterName,
      positionName: isMC
        ? character.position
        : characters[characterName].position,
      level: character.level,
      exp: character.exp,
      constellation: `${
        character.constellation == 0 ? "No " : ""
      }Constellation${character.constellation == 0 ? "" : " "}${this.romanize(
        character.constellation
      )}`,
    };
  }
  
}

module.exports = Game;
