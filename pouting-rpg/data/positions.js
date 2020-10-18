const positions = {
  ["Wave Controller"]: {
    weapon: "catalyst",
    advantage_over: {
      ["Fisherman"]: 2,
    },
  },
  ["Fisherman"]: {
    weapon: "hook",
    advantage_over: {
      ["Spear Bearer"]: 2,
    },
  },
  ["Spear Bearer"]: {
    weapon: "spear",
    advantage_over: {
      ["Wave Controller"]: 2,
    },
  },
  ["Light Bearer"]: {
    weapon: "lighthouse",
    advantage_over: {
      ["Wave Controller"]: 1.5,
      ["Fisherman"]: 1.5,
      ["Spear Bearer"]: 1.5,
      ["Scout"]: 1.5,
    },
  },
  ["Scout"]: {
    weapon: "needle",
    advantage_over: {
      ["Wave Controller"]: 1.5,
      ["Fisherman"]: 1.5,
      ["Spear Bearer"]: 1.5,
      ["Light Bearer"]: 1.5,
    },
  },
};

module.exports = positions;
