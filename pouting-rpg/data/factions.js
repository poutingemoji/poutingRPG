//BASE
const { stripIndents } = require("common-tags");

const factions = {
  ["Zahard Empire"]: {
    leader: "King Zahard",
    description: stripIndents(`
      Zahard's empire relies on strength in battle. They are the empire with 
      the most military power and influence in the Tower and they oversee everything 
      from administering tests to keeping the other powers in check. Their goal is 
      maintaining control over the Tower.
    `),
  },
  ["FUG"]: {
    leader: "Khel Hellam",
    description: stripIndents(`
      FUG relies on analyzing every situation. They are the most dangerous and secretive 
      criminal syndicate in the Tower and conduct their business in the shadows. Their 
      goal is to kill Zahard.
    `),
  },
  ["Wolhaiksong"]: {
    leader: "Urek Mazino",
    description: stripIndents(`
      Wolhaiksong relies on instincts. They are an organization in the Tower whose liberal 
      movements clash against the Empire's conservative practices. Their goal is to find 
      a way out of the Tower.
    `),
  },
};

module.exports = factions;
