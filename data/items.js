const emojis = require("./emojis")
const items = {
  //WEAPON
  hook: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Hook",
    emoji: "",
    type: "weapon",
    baseStats: {
      ATK: 10,
    },
  },

  //OFFHAND
  armorInventory: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Armor Inventory",
    emoji: "",
    type: "offhand",
    baseStats: {
      HP: 10,
    },
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
  copperChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Copper Chunk",
    emoji: "🌰",
    type: "chunk",
  },
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
  beeStinger: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Bee Stinger",
    emoji: "🐝",
    type: "material",
  },
  lizardTail: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Lizard Tail",
    emoji: "🦎",
    type: "material",
  },
  spiderLegs: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Spider Legs",
    emoji: "🕷️",
    type: "material",
  },
  antAntennae: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Ant Antennae",
    emoji: "🐜",
    type: "material",
  },

  //LOCAL SPECIALTIES
};

module.exports = items;
