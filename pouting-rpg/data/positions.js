const positions = {
  ["Wave Controller"]: {
    weapon: "catalyst",
    advantageOver: {
      ["Fisherman"]: 2,
    },
  },
  ["Fisherman"]: {
    weapon: "hook",
    advantageOver: {
      ["Spear Bearer"]: 2,
    },
  },
  ["Spear Bearer"]: {
    weapon: "spear",
    advantageOver: {
      ["Wave Controller"]: 2,
    },
  },
  ["Light Bearer"]: {
    weapon: "lighthouse",
    advantageOver: {
      ["Wave Controller"]: 1.5,
      ["Fisherman"]: 1.5,
      ["Spear Bearer"]: 1.5,
      ["Scout"]: 1.5,
    },
  },
  ["Scout"]: {
    weapon: "needle",
    advantageOver: {
      ["Wave Controller"]: 1.5,
      ["Fisherman"]: 1.5,
      ["Spear Bearer"]: 1.5,
      ["Light Bearer"]: 1.5,
    },
  },
};

module.exports = positions;
