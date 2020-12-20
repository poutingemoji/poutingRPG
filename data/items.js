const emojis = require("./emojis");
const talents = require("./talents");
const items = {
  //WEAPON
  needle: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Needle",
    emoji: "🪡",
    type: "weapon",
    baseStats: {
      ATK: 10,
    },
    talents: {
      passive: talents.passive["criticalStrike"],
    },
    recipe: {
      suspendium: 3,
    }
  },

  //OFFHAND
  armorInventory: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Armor Inventory",
    emoji: "🛡️",
    type: "offhand",
    baseStats: {
      HP: 10,
    },
    talents: {
      passive: talents.passive["vigor"],
    },
    recipe: {
      suspendium: 3,
    }
  },

  //FOOD
  apple: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Apple",
    emoji: "🍎",
    type: "food",
  },
  orange: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Orange",
    emoji: "🍊",
    type: "food",
  },

  metalBar: {
    level: 3,
    weight: 1.0,
    spread: 1,
    name: "Metal Bar",
    emoji: "🦯",
    type: "anvil",
  },
  suspendium: {
    level: 3,
    weight: 1.0,
    spread: 1,
    name: "Suspendium",
    emoji: emojis["suspendium"],
    type: "anvil",
  },
};

module.exports = items;
