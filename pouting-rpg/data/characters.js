const positions = require("./positions");
const characters = {
  ["Irregular"]: {
    level: 1,
    weight: 1.0,
    spread: 1,
    baseStats: {
      HP: 150,
      ATK: 30,
    },
    talents: positions["Fisherman"].talents[0],
  },

  ["Rachel"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    position: "Light Bearer",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
  ["Ship Leesoo"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    position: "Scout",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
  ["Serena Rinnen"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    position: "Scout",
    baseStats: {
      HP: 10,
      ATK: 10,
    },
    talents: {},
  },
};
module.exports = characters;
