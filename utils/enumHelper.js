const enumHelper = {
  isMC: (characterName) => {
    return characterName == "Traveller";
  },
  maxHealth: (level) => {
    return 100 + level * 5;
  },
  maxHealth: (level) => {
    return 100 + level * 5;
  },
  leaderboardFilters: {
    level: {
      sort: { level: -1, "experience.current": -1 },
      where: "level",
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
  pageLength: 10,
  links: {
    website: "https://poutingemoji.github.io/poutingbot/",
    commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
    supportServer: "https://Discord.gg/nGVe96h",
  },
  //Colors
  colors: {
    embed: {
      bot: "#aacda4",
      game: "#2f3136",
    },
    position: {
      fisherman: "#db3043",
      spearbearer: "#c06850",
      scout: "#79b15a",
      lightbearer: "#ffd984",
      wavecontroller: "#50a5e6",
    },
    mood: {
      Great: "#50a5e6",
      Fine: "#f4f8fb",
      Full: "#9266c7",
      Hungry: "#db3043",
      Clean: "#a8dafe",
      Dirty: "#c06850",
      Happy: "#79b15a",
      Bored: "#687681",
      Energized: "#fe7894",
      Tired: "#202226",
    },
  },
  moods: [
    { high: "Full", low: "Hungry" },
    { high: "Clean", low: "Dirty" },
    { high: "Happy", low: "Bored" },
    { high: "Energized", low: "Tired" },
  ],
  expFormulas: {
    fast: "floor(((4*n)^3)/5)",
    medium_fast: "floor(n^3)",
    medium_slow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
    slow: "floor(((5*n)^3)/4)",
  },
  maxHealth: (level) => {
    return 100 + level * 5;
  },
  maxEnergy: (level) => {
    return 50 + level * 5;
  },
  moveAccuracy: (move) => {
    return clamp(Math.round(100 - move * 0.9), 1, 100);
  },
  movePower: (move) => {
    return Math.round((move + 1) * 4.5);
  },
  petNeeds: ["hunger", "hygiene", "fun", "energy"],
  petActions: {
    feed: "hunger",
    wash: "hygiene",
    play: "fun",
    pat: "energy",
  },
  fishes: {
    ["Shrimp"]: {
      emoji: "🦐",
      points: 15,
      rarity: 60,
    },
    ["Fish"]: {
      emoji: "🐟",
      points: 20,
      rarity: 50,
    },
    ["Tropical Fish"]: {
      emoji: "🐠",
      points: 20,
      rarity: 40,
    },
    ["Blowfish"]: {
      emoji: "🐡",
      points: 25,
      rarity: 35,
    },
    ["Squid"]: {
      emoji: "🦑",
      points: 30,
      rarity: 30,
    },
    ["Octopus"]: {
      emoji: "🐙",
      points: 30,
      rarity: 30,
    },
    ["Metalfish"]: {
      emoji: "⚙️",
      points: 40,
      rarity: 20,
    },
    ["Silver Fish"]: {
      emoji: "⛓️",
      points: 50,
      rarity: 15,
    },
    ["Crystal Shard"]: {
      emoji: "💠",
      points: 90,
      rarity: 10,
    },
    ["Valuable Object"]: {
      emoji: "🏺",
      points: 100,
      rarity: 5,
    },
    ["Baby Zygaena"]: {
      emoji: "💮",
      points: 150,
      rarity: 1,
    },
    ["Sweetfish"]: {
      emoji: "🦈",
      dallars: 5,
      rarity: 5,
    },
    ["Boot"]: {
      emoji: "👢",
      points: 0,
      rarity: 3,
    },
    ["Brick"]: {
      emoji: "🧱",
      points: 0,
      rarity: 3,
    },
    ["\nTotal Amount"]: {
      emoji: "",
    },
  },
};

module.exports = enumHelper;
