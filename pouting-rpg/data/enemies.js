const enemies = {
  ["White Steel Eel"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    type: "Boss",
    floor: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {attack: "Vicious Backstab", defend: "Tit for Tat", passive: "Dodge"},
    drops: {["Sweetfish"]: 4, ["Baby Zygaena"]: 69},
  },
  ["Ball"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    type: "Special",
    floor: 1,
    baseStats: {
      HP: 50,
    },
    drops: {["Sweetfish"]: 4, ["Baby Zygaena"]: 69},
  },
};

module.exports = enemies;
