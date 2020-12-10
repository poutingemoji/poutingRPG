const characters = require("../data/characters");
const enemies = require("../data/enemies");

const enumHelper = {
  adventureRankRanges: {
    1: {
      towerLevel: 0,
      maxLevel: 20,
    },
    15: {
      towerLevel: 0,
      maxLevel: 40,
    },
    20: {
      towerLevel: 1,
      maxLevel: 40,
    },
    25: {
      towerLevel: 2,
      maxLevel: 50,
      ascensionQuest: true,
    },
  },
  inventoryCategories: {
    equipment: ["weapon", "offhand"],
    food: ["food"],
    materials: ["chunk", "material"],
  },
  commandGroups: {
    administrative: "Administrative Commands",
    adventure: "Adventure Commands",
    fighting: "Fighting Commands",
    general_info: "General Info Commands",
    user_info: "User Info Commands",
  },
  talentTypes: {
    attack: {
      emoji: "💥",
    },
    support: {
      emoji: "🤝",
    },
    passive: {
      emoji: "🕊️",
    },
  },
  battleChoices: ["attack", "support"],
  responseWaitTime: 60000,
  pageLength: 10,
  //Sets
  talkedRecently: new Set(),
  waitingOnResponse: new Set(),
  isInBattle: new Set(),
  //Team
  maxTeams: 3,
  isEnemy(enemyId) {
    return enemies.hasOwnProperty(enemyId);
  },
  links: {
    website: "https://poutingemoji.github.io/poutingbot/",
    commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
    supportServer: "https://discord.gg/nGVe96h",
  },
  expFormulas: {
    player: "floor((n-1)*125)",
    character: "floor(n^3)",

    fast: "floor(((4*n)^3)/5)",
    mediumFast: "floor(n^3)",
    mediumSlow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
    slow: "floor(((5*n)^3)/4)",
  },
  leaderboardFilters: {
    adventureRank: {
      sort: { "adventureRank.current": -1, "exp.current": -1 },
      where: "adventureRank.current",
    },
    points: {
      sort: { points: -1 },
      where: "points",
    },
    poutingems: {
      sort: { poutingems: -1 },
      where: "poutingems",
    },
    /*
    fish: {
      sort: { "fishes.\nTotal Amount": -1 },
      where: "fishes.\nTotal Amount",
      gte: 1,
    },*/
  },
};

module.exports = enumHelper;
