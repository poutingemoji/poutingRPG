const BattleObject = require("./BattleObject");
const items = require("../../data/items");
const talents = require("../../data/talents");
const { rarities, itemCategories } = require("../enumHelper");

class Character extends BattleObject {
  constructor(params) {
    super(params);
    const { id, rarity, weaponId } = params;
    if (!rarities[rarity - 1])
      throw new Error(`${id}'s rarity, ${rarity}, is illegal.`);
    this.rarity = rarity;
    if (!items[weaponId]) throw new Error(`${weaponId} is not a valid weapon.`);
    this.weaponId = weaponId;
  }
}

//Elements
class Anemo extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Geo extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Electro extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Dendro extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Hydro extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Pyro extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Cryo extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

module.exports = {
  Anemo,
  Geo,
  Electro,
  Dendro,
  Hydro,
  Pyro,
  Cryo,
};
