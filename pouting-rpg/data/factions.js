//BASE
const { stripIndents } = require("common-tags");

const factions = {
  ["Zahard Empire"]: {
    leader: "King Zahard",
    description: stripIndents(`
      The Empire has the most military power and influence in the Tower and administers the floor tests.
      **Relies On:** strength in battle
      **Goal:** maintaining control over the Tower
    `),
  },
  ["FUG"]: {
    leader: "Khel Hellam",
    description: stripIndents(`
      They are the most dangerous and secretive criminal syndicate in the Tower and conduct their business in the shadows. 
      **Relies On:** analyzing every situation
      **Goal:** killing Zahard to overthrow his rule 
    `),
  },
  ["Wolhaiksong"]: {
    leader: "Urek Mazino",
    description: stripIndents(`
      They are an organization in the Tower whose liberal movements clash against the Empire's conservative practices.
      **Relies On:** instincts
      **Goal:** finding a way out of the Tower
    `),
  },
};

module.exports = factions;
