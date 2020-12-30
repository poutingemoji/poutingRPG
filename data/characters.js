const Item = require("../Base/Item")
const emojis = require("./emojis");
const items = require("./items");

class Character extends Item {
  constructor(params) {
    super(params)
    if (!params.volume) return console.error(`${params.name} doesn't have a volume.`)
    this.volume = params.volume;
    const weapon = items[params.weaponId]
    const offhand = items[params.offhandId]
    if (!weapon) return console.error(`${params.name}'s weapon, ${params.weaponId}, is illegal.`)
    if (!offhand) return console.error(`${params.name}'s offhand, ${params.offhandId}, is illegal.`)
    this.weapon = weapon
    this.offhand = offhand
  }
}

//Positions
class WaveController extends Character {
  constructor(params) {
    super(params)
    this.position = {
      name: "Wave Controller",
      emoji: emojis["wave_controller"],
    }
  }
  ultimate() {

  }
}

class LightBearer extends Character {
  constructor(params) {
    super(params)
    this.position = {
      name: "Light Bearer",
      emoji: emojis["light_bearer"],
    }
  }
  ultimate() {

  }
}

class SpearBearer extends Character {
  constructor(params) {
    super(params)
    this.position = {
      name: "Spear Bearer",
      emoji: emojis["spear_bearer"],
    }
  }
  ultimate() {

  }
}

class Fisherman extends Character {
  constructor(params) {
    super(params)
    this.position = {
      name: "Fisherman",
      emoji: emojis["fisherman"],
    }
  }
  ultimate() {

  }
}

class Scout extends Character {
  constructor(params) {
    super(params)
    this.position = {
      name: "Scout",
      emoji: emojis["scout"],
    }
  }
  ultimate() {

  }
}

const characters = {
  twentyFifthBaam: new WaveController({
    rarity: 4,
    name:"Twenty-Fifth Baam",
    emoji: emojis["twenty_fifth_baam"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
 }),
  khunAgueroAgnis: new LightBearer({
    rarity: 4,
    name: "Khun Aguero Agnis",
    emoji: emojis["khun_aguero_agnis"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  rakWraithraiser: new SpearBearer({
    rarity: 4,
    name: "Rak Wraithraiser",
    emoji: emojis["rak_wraithraiser"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  androssiZahard: new Fisherman({
    rarity: 4,
    name: "Androssi Zahard",
    emoji: emojis["androssi_zahard"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  shipLeesoo: new Scout({
    rarity: 4,
    name: "Ship Leesoo",
    emoji: emojis["ship_leesoo"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  kingZahard: new Scout({
    rarity: 4,
    name: "King Zahard",
    emoji: emojis["king_zahard"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  karaka: new Scout({
    rarity: 4,
    name: "Karaka",
    emoji: emojis["karaka"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  urekMazino: new Scout({
    rarity: 4,
    name: "Urek Mazino",
    emoji: emojis["urek_mazino"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
};
module.exports = characters;

  /*
  SPECIAL POSITIONS
  Guides
  Anima
  Jeonsulsa
  Hwayeomsa
  targeted
  Unknown Position
  */