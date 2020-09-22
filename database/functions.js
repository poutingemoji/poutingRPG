const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const playerSchema = require("./schemas/player");
const Player = mongoose.model("Player", playerSchema);

const { clamp, isBetween } = require("../utils/Helper");
const { confirmation } = require("../utils/msgHelper");
const {
  maxHealth,
  maxShinsu,
  expFormulas,
  petNeeds,
} = require("../utils/enumHelper");
const { newPet } = require("./Objects");

const families = require("../docs/data/families.js");
const races = require("../docs/data/races.js");
const positions = require("../docs/data/positions.js");
const pets = require("../docs/data/pets.js");
const arcs = require("../docs/data/arcs.js");
const moves = require("../docs/data/moves.js");

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
      this.shinsu = maxShinsu(this.level);
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
    save(this);
  },
  incrementValue(key, value) {
    this[key] += value;
    save(this);
  },
  addStatPoints(stat, value) {
    this[stat] += value;
    save(this);
  },
  addQuests() {
    save(this, { quests: arcs[this.arc].chapters[this.chapter].quests });
  },
  getAvailableMoves() {
    let availableMoves = [];
    const familyMoves = families[this.family].moves;
    const positionMoves = positions[this.position].moves;
    for (var key in moves) {
      if (this.move.includes(key)) continue
      if (
        familyMoves.hasOwnProperty(key) ||
        positionMoves.hasOwnProperty(key)
      ) {
        if (this.level > familyMoves[key] || this.level > positionMoves[key]) {
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
  if (update && !update.hasOwnProperty("$unset")) update = Object.assign(player, update);
  Player.updateOne(
    { playerId: player.playerId },
    update || player,
    { upsert: true },
    (err, res) => {
      console.log(res);
    }
  );
}
