const Entity = require("./_Entity");
const items = require("../../data/items")
const talents = require("../../data/talents");
const { talentTypes } = require("../enumHelper");

class Character extends Entity {
  constructor(params) {
    super(params);
    if (!params.volume)
      return console.error(`${params.name} doesn't have a volume.`);
    this.volume = params.volume;
    const weapon = items[params.weaponId];
    const offhand = items[params.offhandId];
    if (!weapon)
      return console.error(
        `${params.name}'s weapon, ${params.weaponId}, is illegal.`
      );
    if (!offhand)
      return console.error(
        `${params.name}'s offhand, ${params.offhandId}, is illegal.`
      );
    this.weapon = weapon;
    this.offhand = offhand;

    this.talents = {};
    const talentIds = [params.attackId, params.supportId, params.passiveId];
    talentIds.map((talentId, i) => {
      const talentType = talentTypes[i].toLowerCase();
      if (!talentId) return;
      if (!talents[talentId])
        return console.error(
          `${params.name}'s ${talentType}, ${talentId}, is illegal.`
        );
      this.talents[talentType] = talents[talentId];
    }, this);

    this.baseStats = {};
    if (params.HP) this.baseStats.HP = params.HP;
    if (params.ATK) this.baseStats.ATK = params.ATK;
  }
}

//Positions
class WaveController extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class LightBearer extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class SpearBearer extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Fisherman extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

class Scout extends Character {
  constructor(params) {
    super(params);
  }
  ultimate() {}
}

module.exports = {
  WaveController,
  LightBearer,
  SpearBearer,
  Fisherman,
  Scout,
};
