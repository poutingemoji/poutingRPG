const characters = require("../data/characters");
const enemies = require("../data/enemies");

const enumHelper = {
  inventoryCategories: {
    equipment: ["Weapon", "Offhand"],
    food: ["Food"],
    materials: ["Chunk", "Material"],
  },
  commandGroups: {
    administrative: "Administrative Commands",
    adventure: "Adventure Commands",
    fighting: "Fighting Commands",
    general_info: "General Info Commands",
    user_info: "User Info Commands",
  },
  battleChoices: {
    atk: "attack",
    sup: "support",
  },
  talentTypes: {
    attack: {
      emoji: "🗡️",
    },
    support: {
      emoji: "🤝",
    },
    passive: {
      emoji: "🕊️",
    },
  },
  responseWaitTime: 60000,
  pageLength: 10,
  //Sets
  talkedRecently: new Set(),
  waitingOnResponse: new Set(),
  isInBattle: new Set(),
  //Team
  maxTeamMembers: 3,
  maxTeams: 5,
  protagonist: { id: Object.keys(characters)[0] },
  isProtagonist(characterId) {
    return characterId == this.protagonist.id;
  },
  isEnemy(enemyId) {
    return enemies.hasOwnProperty(enemyId);
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
