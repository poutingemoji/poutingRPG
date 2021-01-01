const Entity = require("./_Entity");
const talents = require("../../data/talents");
const { rarities, talentTypes } = require("../enumHelper");

class Item extends Entity {
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
    super({ name, emoji, description });
    if (!rarities[rarity - 1])
      return console.error(`${name}'s rarity, ${rarity}, is illegal.`);
    this.rarity = rarity;

    this.baseStats = {};
    if (HP) this.baseStats.HP = HP;
    if (ATK) this.baseStats.ATK = ATK;
    this.talents = {};
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

module.exports = { Food, Material, Ingredient, Weapon, Offhand };
