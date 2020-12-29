const { suspendium } = require("./emojis");
const emojis = require("./emojis");
const talents = require("./talents");
const { rarities } = require("../utils/enumHelper");

class Item {
  constructor(name, rarity, emoji = "") {
    if (!rarities[rarity - 1]) return console.log("Invalid rarity.");
    this.name = name;
    this.emoji = emoji;
    this.rarity = rarity;

    this.level = 1;
    this.weight = 1.0;
    this.spread = 1;
  }
}

class Weapon extends Item {
  constructor({ name, rarity, emoji, ATK, passiveId }) {
    super(name, rarity, emoji);
    if (!talents.passive[passiveId]) return console.log("Invalid passive.");
    this.baseStats = {
      ATK: ATK,
    };
    this.talents = {
      passive: talents.passive["criticalStrike"],
    };
    this.recipe = {
      suspendium: 3,
    };
  }
}

class Offhand extends Item {
  constructor({ name, rarity, emoji, HP, passiveId }) {
    super(name, rarity, emoji);
    if (!talents.passive[passiveId]) return console.log("Invalid passive.");
    this.baseStats = {
      HP: HP,
    };
    this.talents = {
      passive: talents.passive[passiveId],
    };
    this.recipe = {
      suspendium: 3,
    };
  }
}

class Food extends Item {
  constructor({ name, rarity, emoji }) {
    super(name, rarity, emoji);
  }
}

const items = {
  needle: new Weapon({
    name: "Needle",
    rarity: 1,
    emoji: "🪡",
    ATK: 10,
    passiveId: "criticalStrike",
  }),
  armorInventory: new Offhand({
    name: "Armor Inventory",
    rarity: 1,
    emoji: "🛡️",
    HP: 10,
    passiveId: "vigor",
  }),
  apple: new Food({
    name: "Apple",
    rarity: 1,
    emoji: "🍎",
  }),
  orange: new Food({
    name: "Orange",
    rarity: 1,
    emoji: "🍊",
  }),
  //ANVIL
  metalBar: new Food({
    name: "Metal Bar",
    rarity: 3,
    emoji: "🦯",
    description: "Yes its a metal bar.",
  }),
  suspendium: new Food({
    name: "Suspendium",
    rarity: 3,
    emoji: emojis["suspendium"],
    description: "Yes its suspendium.",
  }),
};

module.exports = items;
