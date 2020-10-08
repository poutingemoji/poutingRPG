const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const playerSchema = require("./schemas/player");
const Player = mongoose.model("Player", playerSchema);

const Arcs = require("../docs/data/Arcs");
const Characters = require("../docs/data/Characters");
const Items = require("../docs/data/Items");
const Positions = require("../docs/data/Positions");

const Parser = require("expr-eval").Parser;

const functions = {
  //Player Functions
  addExp(value, msg) {
    const level_Prev = this.level;
    this.EXP += value;

    while (this.EXP >= this.Max_EXP) {
      this.level++;
      this.EXP -= this.Max_EXP;
      this.Max_EXP = Parser.evaluate(expFormulas["player"], {
        n: this.level + 1,
      });
      this.health = maxHealth(this.level);
      this.shinsu = maxEnergy(this.level);
      this.statpoints += statpointsPerLevel;
    }

    if (this.level !== level_Prev) {
      msg.say(
        `🆙 Congratulations ${msg.author.toString()}, you've reached level **${
          this.level
        }**!\n\n`
      );
    }
    save(this);
  },
  changeValue(key, value) {
    this[key] = value;
    save(this);
  },
  incrementValue(key, value) {
    this[key] += value;
    console.log(key, value);
    this.incrementQuest("Collect", key, value);
    save(this);
  },
  addQuests() {
    save(this, { quests: Arcs[this.arc].chapters[this.chapter].quests });
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
      quest.progress += Math.min(value, quest.goal - quest.progress);
    }
  },
  //Character Functions
  getCharProperty(property, msg, id = this.selected_Character) {
    const char = this.characters_Owned[id];
    if (!char) return;
    console.log(char.weapon);
    switch (property) {
      case "name":
        return id == "irregular" ? msg.author.username : Characters[id].name;
      case "position":
        return char.hasOwnProperty("position")
          ? char.position
          : Characters[id].position;
      case "weapon":
        return Items[char.weapon].name;
      case "attributes":
        return Characters[id].attributes;
      case "rarity":
        return Characters[id].rarity;
      default:
        return char[property];
    }
  },
  giveCharWeapon(weapon) {
    if (Items[weapon].type !== "weapon") return;
    if (!this.inventory.hasOwnProperty(weapon)) return;
    const char = this.characters_Owned[this.selected_Character];

    //Delete Weapon From Inventory And Give to Character
    if (this.inventory[weapon] == 1) {
      delete this.inventory[weapon];
    } else {
      this.inventory[weapon] -= 1;
    }

    //Put Character's Weapon Back into Inventory
    if (!this.inventory[char.weapon]) {
      this.inventory[char.weapon] = 1;
    } else {
      this.inventory[char.weapon] += 1;
    }

    char.weapon = weapon;
    save(this);
  },
};

module.exports = functions;

function save(player, update) {
  console.log(player.inventory);
  if (update && !update.hasOwnProperty("$unset"))
    update = Object.assign(player, update);
  Player.updateOne(
    { id: player.id },
    update || player,
    { upsert: true },
    (err, res) => {
      console.log(res);
    }
  );
}
