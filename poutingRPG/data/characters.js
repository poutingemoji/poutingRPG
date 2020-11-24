const emojis = require("./emojis")
const positions = require("./positions");
const talents = require("./talents");

const characters = {
  kingZahard: {
    name: "King Zahard",
    emoji: emojis["king_zahard"],
  },
  khelHellam: {
    name: "Khel Hellam",
    emoji: emojis["khel_hellam"],
  },
  urekMazino: {
    name: "Urek Mazino",
    emoji: emojis["urek_mazino"],
  },
  irregular: {
    level: 1,
    weight: 1.0,
    spread: 1,
    name: "Irregular",
    baseStats: {
      HP: 150,
      ATK: 30,
    },
    talent: {
      attack: "Storm",
      defend: "Attack",
      passive: "Healing Strike",
    },
    weapon: "Basic Hook",
    offHand: "Armor Inventory",
  },
  rachel: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Rachel",
    position: "Light Bearer",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
  shipLeesoo: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Ship Leesoo",
    position: "Scout",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
  serenaRinnen: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Serena Rinnen",
    position: "Scout",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
};
module.exports = characters;
