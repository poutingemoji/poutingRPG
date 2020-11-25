const enemies = {
  whiteSteelEel: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "White Steel Eel",
    type: "Boss",
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {attack: "Vicious Backstab", defend: "Tit for Tat", passive: "Dodge"},
    drops: {copperChunk: 4, ironChunk: 69},
  },
  ball: {
    level: 4,
    weight: 4.0,
    spread: 4,
    name: "Ball",
    type: "Special",
    baseStats: {
      HP: 50,
    },
    talents: {attack: "Vicious Backstab", defend: "Tit for Tat", passive: "Dodge"},
    drops: {copperChunk: 4, ironChunk: 69},
  },
};

module.exports = enemies;
