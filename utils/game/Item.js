const { aggregation } = require("./../../Base/Util");
const Instance = require("./Instance");
const BattleObject = require("./BattleObject");
const { rarities } = require("../enumHelper");

class Item extends Instance {
  constructor(params) {
    super(params);
    const { id, rarity } = params;
    if (!rarities[rarity - 1])
      throw new Error(`${id}'s rarity, ${rarity}, is illegal.`);
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

//Weapons
class Weapon extends aggregation(Item, BattleObject) {
  constructor(params) {
    super(params);
    if (params.instructions) this.instructions = params.instructions;
  }
}

class Sword extends Weapon {
  constructor(params) {
    super(params);
  }
}

class Claymore extends Weapon {
  constructor(params) {
    super(params);
  }
}

class Polearm extends Weapon {
  constructor(params) {
    super(params);
  }
}

class Catalyst extends Weapon {
  constructor(params) {
    super(params);
  }
}

class Bow extends Weapon {
  constructor(params) {
    super(params);
  }
}

module.exports = {
  Food,
  Material,
  Ingredient,
  Sword,
  Claymore,
  Polearm,
  Catalyst,
  Bow,
};
