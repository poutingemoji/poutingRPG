const {
  Food,
  Material,
  Ingredient,
  Weapon,
  Offhand,
} = require("../utils/game/Item");
const emojis = require("./emojis");

module.exports = {
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
    talentIds: {
      passive: "criticalStrike",
    },
  }),
  armorInventory: new Offhand({
    rarity: 1,
    name: "Armor Inventory",
    emoji: "🛡️",
    HP: 10,
    talentIds: {
      passive: "vigor",
    },
  }),
};