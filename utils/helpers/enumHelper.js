const { clamp, isBetween } = require("./intHelper");

const enumHelper = {
  links: {
    website: "https://poutingemoji.github.io/poutingbot/",
    commandlist: "https://poutingemoji.github.io/poutingbot/commands.html",
    supportserver: "https://discord.gg/nGVe96h",
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
  },
  expFormulas: {
    fast: "floor(((4*n)^3)/5)",
    mediumfast: "floor(n^3)",
    mediumslow: "floor((6/5*n^3)-(15*n^2)+(100*n)-140)",
    slow: "floor(((5*n)^3)/4)",
    player: "(n-1)*125",
  },
  maxHealth: (level) => {
    return 100 + level * 5;
  },
  maxEnergy: (level) => {
    return 50 + level * 5;
  },
};

module.exports = enumHelper;
