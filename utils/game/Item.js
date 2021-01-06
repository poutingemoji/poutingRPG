const {aggregation}= require("./../../Base/Util")
const BattleObject = require("./BattleObject");
const Instance = require("./Instance");
const talents = require("../../data/talents");
const { rarities, talentTypes } = require("../enumHelper");

class Item extends Instance {
  constructor(params) {
    super(params);
    const { name, rarity } = params;
    if (!rarities[rarity - 1])
      return console.error(`${name}'s rarity, ${rarity}, is illegal.`);
    this.rarity = rarity;

    this.level = 1;
    this.weight = 1.0;
    this.spread = 1;
  }
}

//Food
class Food extends Item {
  constructor(params) {
    super(params);
  }
}

//Materials
class Material extends Item {
  constructor(params) {
    super(params);
  }
}

class Ingredient extends Item {
  constructor(params) {
    super(params);
  }
}

class Equipment extends aggregation(Item, BattleObject) {
  constructor(params) {
    super(params);
    if (params.instructions) this.instructions = params.instructions;
  }
}

//EQUIPMENT
class Weapon extends Equipment {
  constructor(params) {
    super(params);
  }
}

class Offhand extends Equipment {
  constructor(params) {
    super(params);
  }
}

module.exports = { Food, Material, Ingredient, Weapon, Offhand };
