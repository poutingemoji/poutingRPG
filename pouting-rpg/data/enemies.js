const enemies = {
  ["White Steel Eel"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    type: "Boss",
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talent: {attack: "Vicious Backstab", defend: "Tit for Tat", passive: "Dodge"},
    drops: {["Sweetfish"]: 4, ["Baby Zygaena"]: 69},
  },
  ["Ball"]: {
    level: 4,
    weight: 4.0,
    spread: 4,
    type: "Special",
    baseStats: {
      HP: 50,
    },
    talent: {attack: "Vicious Backstab", defend: "Tit for Tat", passive: "Dodge"},
    drops: {["Sweetfish"]: 4, ["Baby Zygaena"]: 69},
  },
};

module.exports = enemies;
