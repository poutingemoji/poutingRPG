//DATA
const emojis = require("./emojis")
const positions = require("./positions");
const talents = require("./talents");

const characters = {
  irregular: {
    level: 5,
    weight: 5.0,
    spread: 5,
    position: positions["fisherman"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {
      attack: "Storm",
      defend: "Attack",
      passive: "Healing Strike",
    },
    weapon: "Basic Hook",
    offHand: "Armor Inventory",
  },
  twentyFifthBaam: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Twenty-Fifth Baam",
    emoji: "",
    position: positions["waveController"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {},
  },
  khunAgueroAgnis: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Khun Aguero Agnis",
    emoji: "",
    position: positions["lightBearer"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {},
  },
  rakWraithraiser: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Rak Wraithraiser",
    emoji: "",
    position: positions["spearBearer"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {},
  },
  shipLeesoo: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Ship Leesoo",
    emoji: "",
    position: positions["scout"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {},
  },
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
};
module.exports = characters;
