const { Item } = require("./Item");

class Character extends Item {
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
    this.position = {
      name: "Wave Controller",
      emoji: emojis["wave_controller"],
    };
  }
  ultimate() {}
}

class LightBearer extends Character {
  constructor(params) {
    super(params);
    this.position = {
      name: "Light Bearer",
      emoji: emojis["light_bearer"],
    };
  }
  ultimate() {}
}

class SpearBearer extends Character {
  constructor(params) {
    super(params);
    this.position = {
      name: "Spear Bearer",
      emoji: emojis["spear_bearer"],
    };
  }
  ultimate() {}
}

class Fisherman extends Character {
  constructor(params) {
    super(params);
    this.position = {
      name: "Fisherman",
      emoji: emojis["fisherman"],
    };
  }
  ultimate() {}
}

class Scout extends Character {
  constructor(params) {
    super(params);
    this.position = {
      name: "Scout",
      emoji: emojis["scout"],
    };
  }
  ultimate() {}
}

module.exports = {
  Character,
  WaveController,
  LightBearer,
  SpearBearer,
  Fisherman,
  Scout,
};
