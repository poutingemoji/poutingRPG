const { Food, Material, Ingredient, Sword } = require("../utils/game/Item");
const emojis = require("./emojis");
const { convertArrayToObject } = require("../utils/Helper");

module.exports = convertArrayToObject([
  new Food({
    id: "apple",
    rarity: 1,
    emoji: "🍎",
  }),
  new Food({
    id: "orange",
    rarity: 1,
    emoji: "🍊",
  }),
  new Material({
    id: "metalBar",
    rarity: 3,
    emoji: "🦯",
    description: "Yes its a metal bar.",
  }),
  new Material({
    id: "suspendium",
    rarity: 3,
    emoji: emojis["suspendium"],
    description: "Yes its suspendium.",
  }),
  new Sword({
    id: "dullBlade",
    rarity: 1,
    emoji: "🪡",
    ATK: 10,
    talentIds: {
      passive: "criticalStrike",
    },
  }),
]);
