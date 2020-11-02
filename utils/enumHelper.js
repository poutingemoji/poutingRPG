const enumHelper = {
  talkedRecently: new Set(),
  waitingOnResponse: new Set(),
  isInBattle: new Set(),
  pageLength: 10,
  timeUntilFull: {
    HP: 30 * 60,
  },
  isMC: (characterName) => {
    return characterName == "Traveller";
  },
  maxHealth: (level) => {
    return 100 + level * 5;
  },
  maxEnergy: (level) => {
    return 50 + level * 5;
  },
  battleChoices: {
    ["⚔️"]: "attack",
    ["🛡️"]: "defend",
    ["red cross"]: "escape",
  },
  links: {
    website: "https://poutingemoji.github.io/poutingbot/",
    commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
    supportServer: "https://discord.gg/nGVe96h",
  },
  expFormulas: {
    player: "floor(n^3)",
    character: "floor(n^3)",

    fast: "floor(((4*n)^3)/5)",
    medium_fast: "floor(n^3)",
    medium_slow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
    slow: "floor(((5*n)^3)/4)",
  },
  leaderboardFilters: {
    level: {
      sort: { "level.current": -1, "exp.current": -1 },
      where: "level.current",
    },
    points: {
      sort: { points: -1 },
      where: "points",
    },
    dallars: {
      sort: { dallars: -1 },
      where: "dallars",
    },
    fish: {
      sort: { "fishes.\nTotal Amount": -1 },
      where: "fishes.\nTotal Amount",
      gte: 1,
    },
    reputation: {
      sort: { reputation: -1 },
      where: "reputation",
    },
  },
};

module.exports = enumHelper;
