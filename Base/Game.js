//BASE
const BaseHelper = require("../Base/Helper");
const Parser = require("expr-eval").Parser;
const gacha = require("gacha");
const { stripIndents } = require("common-tags");
const { capitalCase, camelCase } = require("change-case");

//DATA
const { newCharacterObj } = require("../database/schemas/character");
const arcs = require("../data/arcs");
const characters = require("../data/characters");
const enemies = require("../data/enemies");
const emojis = require("../data/emojis");
const items = require("../data/items");
const positions = require("../data/positions");
const talents = require("../data/talents");

// UTILS
const Database = require("../database/Database");

const {
  adventureRankRanges,
  expFormulas,
  inventoryCategories,
  isEnemy,
} = require("../utils/enumHelper");

class Game extends BaseHelper {
  constructor(client) {
    super();
    this.Database = new Database(client, this);
  }

  changeSelectedTeam(player, teamNumber) {
    teamNumber--;
    player.teamId = teamNumber;
    this.Database.savePlayer(player);
  }

  //TEAM
  changeTeamMembers(player, action, characterId) {
    const character = this.getCharacter(player, characterId);
    if (!character) return;
    const positionId = Object.keys(positions).find(
      (positionId) => positions[positionId].name == character.position.name
    );

    console.log(characterId);
    switch (action) {
      case "add":
        if (player.teams[player.teamId][positionId] == characterId) return;
        player.teams[player.teamId][positionId] = characterId;
        break;
      case "remove":
        delete player.teams[player.teamId][positionId];
        break;
    }
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

  addExpToPlayer(player, expToAdd) {
    player.exp.current += expToAdd;
    while (
      player.exp.current >= player.exp.total &&
      player.adventureRank.current < player.adventureRank.total
    ) {
      player.adventureRank.current++;
      player.exp.current -= player.exp.total;
      player.exp.total = Parser.evaluate(expFormulas["player"], {
        n: player.adventureRank.current + 1,
      });
    }
    this.Database.savePlayer(player);
  }

  async addValueToPlayer(player, key, value) {
    player[key] += value;
    await this.updateQuestProgress(player, "Earn", key, value);
    this.Database.savePlayer(player);
  }

  //CHARACTER
  addExpToCharacter(player, expToAdd, characterId) {
    const character = player.characters.get(characterId);
    character.exp.current += expToAdd;
    while (
      character.exp.current >= character.exp.total &&
      character.level.current < character.level.total
    ) {
      character.level.current++;
      character.exp.current -= character.exp.total;
      character.exp.total = Parser.evaluate(expFormulas["character"], {
        n: character.level.current + 1,
      });
    }
    this.Database.savePlayer(player);
  }

  addCharacter(player, characterId) {
    if (Object.keys(Array.from(player.characters)).includes(characterId))
      return;
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
    const equip = gacha.roguelike(items, itemFilter);

    // Which item should we spawn on level {n}?
    const lvl = equip[level];
    console.log(lvl);
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

  getAdventureRankRange(player) {
    let previousAR = 1;
    for (let AR in adventureRankRanges) {
      console.log(AR);
      if (this.isBetween(player.adventureRank.current, previousAR, AR))
        return adventureRankRanges[AR];
      previousAR = AR + 1;
    }
  }

  getEquipment(character) {
    inventoryCategories.equipment.map((equipmentType) => {
      const equipment = character[equipmentType];
      const data = Object.assign({}, items[equipment.id], equipment);
      switch (data.type) {
        case "weapon":
          data.ATK = (data.level - 1) * 25 + data.baseStats.ATK;
          character[equipmentType] = data;
          break;
        case "offhand":
          data.HP = (data.level - 1) * 25 + data.baseStats.HP;
          character[equipmentType] = data;
          break;
      }
    });
    return character;
  }

  //BATTLE
  getCharacter(player, characterId) {
    if (!player.characters.get(characterId)) return;
    //prettier-ignore
    const character = Object.assign({}, characters[characterId], player.characters.get(characterId));
    //calculate battlestats
    return {
      name: character.name,
      level: character.level,
      exp: character.exp,
      position: character.position,
      baseStats: character.baseStats,
      HP: (character.level.current - 1) * 10 + character.baseStats.HP,
      ATK: (character.level.current - 1) * 10 + character.baseStats.ATK,
      weapon: character.weapon,
      offhand: character.offhand,
      talents: character.talents,
    };
  }

  getEnemy(player, enemyId) {
    const enemy = enemies[enemyId];
    //calculate battlestats
    return {
      name: enemy.name,
      level: enemy.level,
      HP: enemy.baseStats.HP,
      ATK: enemy.baseStats.ATK,
      talents: enemy.talents,
      drops: enemy.drops,
    };
  }

  getBattleData(player, id) {
    const data = isEnemy(id)
      ? this.getEnemy(player, id)
      : this.getCharacter(player, id);

    const battleData = {
      id,
      name: data.name,
      talents: data.talents,
      HP: data.HP,
      ATK: data.ATK,
      target: { position: null, turns: 0 },
      effects: {},
      takeDamage: function (amount) {
        this.HP = Math.max(this.HP - amount, 0);
      },
    };
    if (!isEnemy(id)) {
      const { weapon, offhand } = this.getEquipment(data);
      battleData.HP += offhand.HP;
      battleData.ATK += weapon.ATK;
    }
    battleData.maxHP = battleData.HP;
    if (data.hasOwnProperty("drops")) battleData.drops = data.drops;
    return battleData;
  }
}

module.exports = Game;
