const characters = require("../poutingRPG/data/characters");
const enemies = require("../poutingRPG/data/enemies");
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
    def: "defend",
  },
  talentTypes: {
    attack: {
      emoji: "🗡️",
    },
    defend: {
      emoji: "🛡️",
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
  isMC: (characterId) => {
    return characterId == "irregular";
  },
  isEnemy(name) {
    return enemies.hasOwnProperty(name);
  },
  getBattleStats(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];
    return {
      name: name,
      HP: this.calculateHealth(data),
      HP_MAX: this.calculateHealth(data),
      ATK: this.calculateAttack(data),
      target: { position: null, turns: 0 },
      effects: {
        ["Yes"]: 3,
      },
    };
  },
  calculateHealth(data) {
    //this.player.adventureRank
    return data.baseStats.HP;
  },
  calculateAttack(data) {
    return data.baseStats.ATK;
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
