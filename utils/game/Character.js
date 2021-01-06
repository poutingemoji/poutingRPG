const BattleObject = require("./BattleObject");
const items = require("../../data/items");
const talents = require("../../data/talents");
const { itemCategories } = require("../enumHelper");

class Character extends BattleObject {
  constructor(params) {
    super(params);
    const { name, season, equipmentIds } = params;
    if (isNaN(season)) throw new Error(`${name} doesn't have a season.`);
    this.season = season;

    this.equipment = {};
    itemCategories.equipment.map((equipmentType) => {
      const equipmentId = equipmentIds[equipmentType.toLowerCase()];
      if (!equipmentId)
        throw new Error(`${name} is missing a ${equipmentType}Id.`);
      const equipment = items[equipmentId];
      if (!equipment)
        throw new Error(`${equipmentId} is not a valid equipment.`);
      if (equipment.constructor.name !== equipmentType)
        throw new Error(`${equipmentId} is not a valid ${equipmentType}.`);
      this.equipment[equipmentType.toLowerCase()] = equipment;
    });
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
