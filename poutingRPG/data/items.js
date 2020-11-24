const emojis = require("./emojis")
const items = {
  //WEAPON
  hook: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Hook",
    type: "Weapon",
    emoji: "",
  },

  //OFFHAND
  armorInventory: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Armor Inventory",
    type: "Offhand",
    emoji: "",
  },

  //FOOD
  apple: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Apple",
    type: "Food",
    emoji: "🍎",
  },
  orange: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Orange",
    type: "Food",
    emoji: "🍊",
  },

  //ORES
  copper: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Copper Chunk",
    type: "Chunk",
    emoji: "",
  },
  iron: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Iron Chunk",
    type: "Chunk",
    emoji: "",
  },
  suspendium: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Suspendium Chunk",
    type: "Chunk",
    emoji: emojis["suspendium"],
  },

  //MATERIALS
  butterflyWings: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Butterfly Wings",
    type: "Material",
    emoji: "🦋",
  },
  frog: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Frog",
    type: "Material",
    emoji: "🐸",
  },
  beeStinger: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Bee Stinger",
    type: "Material",
    emoji: "🐝",
  },
  lizardTail: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Lizard Tail",
    type: "Material",
    emoji: "🦎",
  },
  spiderLegs: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Spider Legs",
    type: "Material",
    emoji: "🕷️",
  },
  antAntennae: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Ant Antennae",
    type: "Material",
    emoji: "🐜",
  },

  //LOCAL SPECIALTIES
};

module.exports = items;
