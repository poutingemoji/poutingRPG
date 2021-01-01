const { pascalCase } = require("change-case");
const Talent = require("../utils/game/Talent");
const enemies = require("../data/enemies");
const enumHelper = {
  leaderboardFilters: {
    level: {
      sort: { "level.current": -1, "exp.current": -1 },
      where: "level.current",
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
  battleChoices: ["attack", "support"],
  talentTypes: Object.keys(Talent).map(pascalCase),
  isEnemy(enemyId) {
    return enemies.hasOwnProperty(enemyId);
  },
  rarities: [
    {
      emoji: "⬜",
      hex: "#e5e7e9",
    },
    {
      emoji: "🟩",
      hex: "#79b15a",
    },
    {
      emoji: "🟦",
      hex: "#55acef",
    },
    {
      emoji: "🟪",
      hex: "#aa8fd6",
    },
    {
      emoji: "🟨",
      hex: "#fdcb58",
    },
  ],
  maxTeams: 3,
  maxTeamMembers: 3,
  pageLength: 10,
  responseWaitTime: 60000,
  itemCategories: {
    equipment: ["weapon", "offhand"],
    food: ["food"],
    materials: ["material", "cookingIngredient"],
  },
  expFormulas: {
    player: "floor((n-1)*125)",
    character: "floor(n^3)",

    fast: "floor(((4*n)^3)/5)",
    mediumFast: "floor(n^3)",
    mediumSlow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
    slow: "floor(((5*n)^3)/4)",
  },
  links: {
    website: "https://poutingemoji.github.io/poutingbot/",
    commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
    supportServer: "https://discord.gg/nGVe96h",
  },
  talkedRecently: new Set(),
  waitingOnResponse: new Set(),
  isInBattle: new Set(),
  commandGroups: {
    administrative: "Administrative Commands",
    adventure: "Adventure Commands",
    fighting: "Fighting Commands",
    general_info: "General Info Commands",
    user_info: "User Info Commands",
  },
};

module.exports = enumHelper;
