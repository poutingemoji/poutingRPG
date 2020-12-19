//BASE
const BaseHelper = require("../Base/Helper");
const Parser = require("expr-eval").Parser;
const gacha = require("gacha");
const { stripIndents } = require("common-tags");
const { capitalCase, camelCase } = require("change-case");
const { aggregation } = require("./Util");

//DATA
const { newEquipmentObj } = require("../database/schemas/equipment");
const { newCharacterObj } = require("../database/schemas/character");
const arcs = require("../data/arcs");
const characters = require("../data/characters");
const enemies = require("../data/enemies");
const emojis = require("../data/emojis");
const items = require("../data/items");
const positions = require("../data/positions");
const talents = require("../data/talents");

// UTILS
const Team = require("../utils/game/Team");
const Database = require("../database/Database");

const {
  maxTeamMembers,
  adventureRankRanges,
  expFormulas,
  itemCategories,
  maxTeams,
} = require("../utils/enumHelper");

class Game extends aggregation(Team, BaseHelper) {
  constructor(client) {
    super();
    this.Database = new Database(client, this);
  }

  //EQUIPMENT
  addEquipment(player, equipmentId) {
    player.equipments.push(newEquipmentObj(equipmentId, player.level.current));
    this.Database.savePlayer(player);
  }

  equip() {}

  //EXPERIENCE
  addExpToPlayer(player, expToAdd) {
    addExp(player, expToAdd, expFormulas["player"]);
    this.Database.savePlayer(player);
  }

  addExpToCharacter(player, expToAdd, characterId) {
    const character = player.characters.get(characterId);
    if (!character) return;
    addExp(character, expToAdd, expFormulas["character"]);
    this.Database.savePlayer(player);
  }

  //PLAYER
  async findPlayer(user, msg) {
    const player = await this.Database.loadPlayer(user.id);
    if (!player) {
      if (msg) {
        msg.reply(
          msg.author.id == user.id
            ? `Please type \`${msg.guild.commandPrefix}start\` to begin.`
            : `${user.username} hasn't started climbing the Tower.`
        );
      }
      return false;
    }
    player.username = user.username;
    return player;
  }

  async addValueToPlayer(player, key, value) {
    player[key] += value;
    await this.updateQuestProgress(player, "Earn", key, value);
    this.Database.savePlayer(player);
  }

  //CHARACTER
  addCharacter(player, characterId) {
    if (player.characters.get(characterId)) return;
    player.characters.set(characterId, newCharacterObj(characterId));
    this.Database.savePlayer(player);
  }

  //INVENTORY
  addItem(player, item, amount = 1) {
    player.inventory.get(item)
      ? player.inventory.set(item, player.inventory.get(item) + amount)
      : player.inventory.set(item, amount);
    this.updateQuestProgress(player, "Collect", item);
    this.Database.savePlayer(player);
  }

  removeItem(player, item, amount = 1) {
    //prettier-ignore
    player.inventory.get(item) >= 2
        ? player.inventory.set(item, player.inventory.get(item) - this.clamp(amount, 0, player.inventory.get(item)))
        : player.inventory.delete(item);
    this.Database.savePlayer(player);
  }

  //ITEMS
  roguelike(items, level, itemFilter) {
    // Which item should we spawn on level {n}?
    const lvl = gacha.roguelike(items, itemFilter)[level];
    const strata = Math.random() * lvl.total;
    for (let i = 0; i < lvl.strata.length; i++) {
      if (strata <= lvl.strata[i]) {
        const id = lvl.lookup[i];
        return id;
      }
    }
  }

  //QUESTS
  findQuestType(player, type, id) {
    for (let i = 0; i < player.quests.story.length; i++) {
      if (player.quests.story[i].type == type) {
        if (id && player.quests.story[i].questId == id) {
          return player.quests.story[i];
        } else if (!id) {
          return player.quests.story[i];
        }
      }
    }
    return false;
  }

  async updateQuestProgress(player, type, id, value = 1) {
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

  addQuests(player) {
    this.Database.savePlayer(player, {
      "quests.story":
        arcs[player.progression.story.arc].chapters[
          player.progression.story.chapter
        ].quests,
    });
  }

  //GETTERS
  getAdventureRankRange(player) {
    let previousAR = 1;
    for (let AR in adventureRankRanges) {
      console.log(AR);
      if (this.isBetween(player.adventureRank.current, previousAR, AR))
        return adventureRankRanges[AR];
      previousAR = AR + 1;
    }
  }

  getCharacter(player, characterId) {
    if (!player.characters.get(characterId)) return;
    console.log(characterId);
    const character = Object.assign(
      {},
      characters[characterId],
      player.characters.get(characterId)
    );
    //calculate battlestats
    character.id = characterId;
    character.baseStats = {
      HP: (character.level.current - 1) * 10 + character.baseStats.HP,
      ATK: (character.level.current - 1) * 10 + character.baseStats.ATK,
    };
    character.weapon = this.getEquipment(character.weapon);
    character.offhand = this.getEquipment(character.offhand);
    return character;
  }

  getEnemy(player, enemyId) {
    const enemy = enemies[enemyId];
    enemy.id = enemyId;
    //calculate battlestats
    /*
    enemy.baseStats = {
      HP: (player.level.current - 1) * 10 + enemy.baseStats.HP,
      ATK: (player.level.current - 1) * 10 + enemy.baseStats.ATK,
    }*/
    return enemy;
  }

  getEquipment(equipment) {
    console.log(equipment);
    if (!itemCategories.equipment.includes(items[equipment.id].type)) return;
    const data = Object.assign({}, items[equipment.id], equipment);
    data.baseStats.hasOwnProperty("ATK")
      ? (data.baseStats.ATK = (data.level - 1) * 25 + data.baseStats.ATK)
      : (data.baseStats.HP = (data.level - 1) * 25 + data.baseStats.HP);
    return data;
  }
}

module.exports = Game;

function addExp(obj, expToAdd, expFormula) {
  obj.exp.current += expToAdd;
  while (
    obj.exp.current >= obj.exp.total &&
    obj.level.current < obj.level.total
  ) {
    obj.level.current++;
    obj.exp.current -= obj.exp.total;
    obj.exp.total = Parser.evaluate(expFormula, {
      n: obj.level.current + 1,
    });
  }
}
