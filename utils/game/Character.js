const Entity = require("./_Entity");
const items = require("../../data/items")

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
