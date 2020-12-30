const Item = require("../Base/Item")
const emojis = require("./emojis");

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

class CookingIngredient extends Item {
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

const items = {
  apple: new Food({
    rarity: 1,
    name: "Apple",
    emoji: "🍎",
  }),
  orange: new Food({
    rarity: 1,
    name: "Orange",
    emoji: "🍊",
  }),
  //ANVIL
  metalBar: new Material({
    rarity: 3,
    name: "Metal Bar",
    emoji: "🦯",
    description: "Yes its a metal bar.",
  }),
  suspendium: new Material({
    rarity: 3,
    name: "Suspendium",
    emoji: emojis["suspendium"],
    description: "Yes its suspendium.",
  }),
  needle: new Weapon({
    rarity: 1,
    name: "Needle",
    emoji: "🪡",
    ATK: 10,
    passiveId: "criticalStrike",
  }),
  armorInventory: new Offhand({
    rarity: 1,
    name: "Armor Inventory",
    emoji: "🛡️",
    HP: 10,
    passiveId: "vigor",
  }),
};

module.exports = items;
