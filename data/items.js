const emojis = require("./emojis")
const items = {
  //WEAPON
  hook: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Hook",
    emoji: "",
    type: "Weapon",
  },

  //OFFHAND
  armorInventory: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Armor Inventory",
    emoji: "",
    type: "Offhand",
  },

  //FOOD
  apple: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Apple",
    emoji: "🍎",
    type: "Food",
  },
  orange: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Orange",
    emoji: "🍊",
    type: "Food",
  },

  //ORES
  copperChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Copper Chunk",
    emoji: "🌰",
    type: "Chunk",
  },
  ironChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Iron Chunk",
    emoji: "🧊",
    type: "Chunk",
  },
  suspendiumChunk: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Suspendium Chunk",
    emoji: emojis["suspendium"],
    type: "Chunk",
  },

  //MATERIALS
  butterflyWings: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Butterfly Wings",
    emoji: "🦋",
    type: "Material",
  },
  frog: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Frog",
    emoji: "🐸",
    type: "Material",
  },
  beeStinger: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Bee Stinger",
    emoji: "🐝",
    type: "Material",
  },
  lizardTail: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Lizard Tail",
    emoji: "🦎",
    type: "Material",
  },
  spiderLegs: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Spider Legs",
    emoji: "🕷️",
    type: "Material",
  },
  antAntennae: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Ant Antennae",
    emoji: "🐜",
    type: "Material",
  },

  //LOCAL SPECIALTIES
};

module.exports = items;
