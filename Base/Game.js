//BASE
const BaseGame = require("../Base/Game");
const Parser = require("expr-eval").Parser;
const gacha = require("gacha");

//DATA
const { newCharacterObj } = require("../database/schemas/character");
const arcs = require("../data/arcs");
const characters = require("../data/characters");
const enemies = require("../data/enemies");
const emojis = require("../data/emojis");
const items = require("../data/items");
const positions = require("../data/positions");

// UTILS
const Database = require("../database/Database");
const PVEBattle = require("../utils/game/PVEBattle");
const enumHelper = require("../utils/enumHelper");

class Game {
  constructor(client) {
    this.Database = new Database(client, this);
  }

  //TEAM
  manageTeam(player, action, teamNumber, characterId) {
    teamNumber -= 1;
    if (!this.isBetween(teamNumber, 0, enumHelper.maxTeams)) return;
    if (characterId && !player.characters.includes(characterId)) return;

    switch (action) {
      case "select":
        player.teamId = teamNumber;
        break;
      case "add":
        if (player.teams[teamNumber].includes(characterId)) return;
        player.teams[teamNumber].push(characterId);
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
        player.teamId = fallbackTeam;
        const index = player.teams[teamNumber].indexOf(characterId);
        if (index !== -1) player.teams[teamNumber].splice(index, 1);
        break;
    }
    this.savePlayer(player);
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
      player.exp.total = Parser.evaluate(enumHelper.expFormulas["player"], {
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
      character.exp.total = Parser.evaluate(
        enumHelper.expFormulas["character"],
        {
          n: character.level.current + 1,
        }
      );
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

  //BATTLE
  getCharacter(player, characterId) {
    //prettier-ignore
    const character = Object.assign({}, player.characters.get(characterId), characters[characterId]);
    //calculate battlestats
    return {
      name: enumHelper.isProtagonist(characterId)
        ? player.username
        : character.name,
      level: character.level,
      exp: character.exp,
      position: enumHelper.isProtagonist(characterId)
        ? positions[player.positionId]
        : character.position,
      baseStats: character.baseStats,
      talents: character.talents,
    };
  }

  getEnemy(player, enemyId) {
    const enemy = enemies[enemyId];
    //calculate battlestats
    return {
      name: enemy.name,
      level: enemy.level,
      baseStats: enemy.baseStats,
      talents: enemy.talents,
    };
  }

  getBattleData(player, id) {
    const data = enumHelper.isEnemy(id)
      ? Object.assign({}, characters[id], this.getEnemy(player, id))
      : Object.assign({}, enemies[id], this.getCharacter(player, id));
    console.log(data)
    return {
      id,
      name: data.name,
      talents: data.talents,
      HP: this.calculateHP(data),
      MaxHP: this.calculateHP(data),
      ATK: this.calculateATK(data),
      target: { position: null, turns: 0 },
      effects: {
        ["Yes"]: 3,
      },
      takeDamage: function(amount) {
        this.HP = Math.max(this.HP-amount, 0)
      },
    };
  }

  calculateHP(data) {
    //this.player.adventureRank
    return data.baseStats.HP;
  }

  calculateATK(data) {
    return data.baseStats.ATK;
  }

  addRewards(player, obj) {
    for (const reward in obj) {
      if (items.hasOwnProperty(reward)) {
        this.addItem(player, reward, obj[reward]);
      } else if (["points", "dallars", "suspendium"].includes(reward)) {
        this.addValueToPlayer(player, reward, obj[reward]);
      }
    }
  }
}

module.exports = Game;
