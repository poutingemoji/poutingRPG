const talents = require("../data/talents");
const { rarities } = require("../utils/enumHelper");

class Item {
  constructor({
    rarity,
    name,
    emoji = "",
    description = "",
    HP,
    ATK,
    attackId,
    supportId,
    passiveId,
  }) {
    if (!rarities[rarity - 1])
      return console.error(`${name}'s rarity, ${rarity}, is illegal.`);
    this.name = name;
    this.emoji = emoji;
    this.description = description;
    this.rarity = rarity;

    this.level = 1;
    this.weight = 1.0;
    this.spread = 1;

    this.baseStats = {};
    if (HP) this.baseStats.HP = HP;
    if (ATK) this.baseStats.ATK = ATK;
    this.talents = {};
    const talentTypes = Object.keys(talents.types);
    const talentIds = [attackId, supportId, passiveId];
    talentIds.map((talentId, i) => {
      const talentType = talentTypes[i].toLowerCase();
      if (!talentId) return;
      if (!talents[talentId])
        return console.error(
          `${name}'s ${talentType}, ${talentId}, is illegal.`
        );
      this.talents[talentType] = talents[talentId];
    }, this);
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

//EQUIPMENT
class Weapon extends Item {
  constructor(params) {
    super(params);
    if (params.instructions) this.instructions = params.instructions;
  }
}

class Offhand extends Item {
  constructor(params) {
    super(params);
    if (params.instructions) this.instructions = params.instructions;
  }
}

module.exports = { Item, Food, Material, Ingredient, Weapon, Offhand };
