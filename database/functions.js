const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const playerSchema = require("./schemas/player");
const Player = mongoose.model("Player", playerSchema);

const { newPet } = require("./Objects");

const {
  maxHealth,
  maxEnergy,
  expFormulas,
  petNeeds,
  totalNumOfMoves,
} = require("../utils/helpers/enumHelper");
const { clamp, isBetween } = require("../utils/helpers/intHelper");
const { confirmation } = require("../utils/helpers/msgHelper");

const arcs = require("../docs/data/arcs.js");
const families = require("../docs/data/families.js");
const moves = require("../docs/data/moves.js");
const pets = require("../docs/data/pets.js");
const positions = require("../docs/data/positions.js");
const races = require("../docs/data/races.js");

const Parser = require("expr-eval").Parser;

const functions = {
  //Player Functions
  addExp(value, msg) {
    let description = "";
    const prevlevel = this.level;
    this.exp += value;

    while (this.exp >= this.expMax) {
      this.level++;
      this.exp -= this.expMax;
      this.expMax = Parser.evaluate(expFormulas["mediumslow"], {
        n: this.level + 1,
      });
      this.health = maxHealth(this.level);
      this.shinsu = maxEnergy(this.level);
      this.statpoints += 5;
    }

    if (this.level !== prevlevel) {
      description += `🆙 Congratulations ${msg.author.toString()}, you've reached level **${
        this.level
      }**!\n\n`;
      description += `⏫ You have gained **${
        (this.level - prevlevel) * 5
      } stat points**! You can assign them using: \`${
        msg.client.commandPrefix
      }stats\`.`;
      msg.say(description);
    }
    save(this);
  },
  addFish(fish) {
    this.fishes.set(fish, this.fishes.get(fish) + 1 || 1);
    this.fishes.set(
      "\nTotal Amount",
      this.fishes.get("\nTotal Amount") + 1 || 1
    );
    this.incrementQuest("Fish", fish);
    save(this);
  },
  incrementValue(key, value) {
    this[key] += value;
    console.log(key, value)
    this.incrementQuest("Collect", key, value);
    save(this);
  },
  upsertMove(newMove, index) {
    if (totalNumOfMoves == this.move.length) {
      this.move[index] = newMove;
    } else if (totalNumOfMoves > this.move.length) {
      this.move.push(newMove);
    }
    save(this);
  },
  addStatPoints(stat, value) {
    this[stat] += value;
    save(this);
  },
  addQuests() {
    save(this, { quests: arcs[this.arc].chapters[this.chapter].quests });
  },
  incrementQuest(type, id, value = 1) {
    var quest;
    for (var i = 0; i < this.quests.length; i++) {
      if (this.quests[i].type == type && this.quests[i].id == id) {
        quest = this.quests[i];
      }
    }
    if (!quest || quest.progress == quest.goal) return;
    if (isNaN(value)) {
      quest.progress = value;
    } else {
      quest.progress += value;
    }
  },
  getAvailableMoves() {
    let availableMoves = [];
    const familyMoves = families[this.family].moves;
    const positionMoves = positions[this.position].moves;
    const raceMoves = races[this.race].moves;
    for (var key in moves) {
      if (this.move.includes(key)) continue;
      if (
        familyMoves.hasOwnProperty(key) ||
        positionMoves.hasOwnProperty(key) ||
        raceMoves.hasOwnProperty(key)
      ) {
        if (
          this.level > familyMoves[key] ||
          this.level > positionMoves[key] ||
          this.level > raceMoves[key]
        ) {
          availableMoves.push(key);
        }
      }
    }
    return availableMoves;
  },
  //Pet Functions
  buyPet(id) {
    this.points -= pets[id].price;
    save(this, newPet(id));
  },

  updateNeedsPet(differences) {
    const needs = petNeeds;
    for (var i in differences)
      this.pet[needs[i]] = clamp(
        (this.pet[needs[i]] += differences[i]),
        0,
        100
      );
    this.pet.updatedAt = new Date();
    save(this);
  },
  addExpPet(value) {
    this.pet.exp += value;
    while (this.pet.exp >= this.pet.expMax) {
      this.pet.level++;
      this.pet.exp -= this.pet.expMax;
      this.pet.expMax = Parser.evaluate(
        expFormulas[pets[this.pet.id].exprate],
        { n: this.pet.level + 1 }
      );
    }
    save(this);
  },
  renamePet(nickname) {
    this.pet.nickname = nickname;
    save(this);
  },
  removePet() {
    save(this, { $unset: { pet: 1 } });
  },
};

module.exports = functions;

function save(player, update) {
  if (update && !update.hasOwnProperty("$unset"))
    update = Object.assign(player, update);
  Player.updateOne(
    { playerId: player.playerId },
    update || player,
    { upsert: true },
    (err, res) => {
      //console.log(res);
    }
  );
}
