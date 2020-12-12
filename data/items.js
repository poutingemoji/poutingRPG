const emojis = require("./emojis");
const talents = require("./talents")
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

  //ORES
  ironChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Iron Chunk",
    emoji: "🧊",
    type: "chunk",
  },
  suspendiumChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Suspendium Chunk",
    emoji: emojis["suspendium"],
    type: "chunk",
  },

  //MATERIALS
  butterflyWings: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Butterfly Wings",
    emoji: "🦋",
    type: "material",
  },
  frog: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Frog",
    emoji: "🐸",
    type: "material",
  },

  //LOCAL SPECIALTIES
};

module.exports = items;
