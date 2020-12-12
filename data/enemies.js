const talents = require("./talents");
const positions = require("./positions");
const enemies = {
  whiteSteelEel: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "White Steel Eel",
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
      passive: positions["fisherman"].talents[0].passive,
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  },
  ball: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Ball",
    baseStats: {
      HP: 50,
      ATK: 0,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
      passive: positions["fisherman"].talents[0].passive,
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  },
};

module.exports = enemies;
