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
  protagonist: { id: Object.keys(characters)[0] },
  isProtagonist(characterId) {
    return characterId == this.protagonist.id;
  },
  isEnemy(name) {
    return enemies.hasOwnProperty(name);
  },
  getBattleStats(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];
    return {
      name: name,
      HP: this.calculateHP(data),
      MaxHP: this.calculateHP(data),
      ATK: this.calculateATK(data),
      target: { position: null, turns: 0 },
      effects: {
        ["Yes"]: 3,
      },
    };
  },
  calculateHP(data) {
    //this.player.adventureRank
    return data.baseStats.HP;
  },
  calculateATK(data) {
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
