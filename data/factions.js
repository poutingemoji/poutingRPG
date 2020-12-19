//BASE
const { stripIndents } = require("common-tags");

//DATA
const characters = require("./characters")
const emojis = require("./emojis")

const factions = {
  zahardEmpire: {
    name: "Zahard Empire",
    emoji: emojis["zahard_empire"],
    leader: characters["kingZahard"],
    description: stripIndents(`
      The Zahard Empire rules over the Tower and administers the floor tests.
      **Relies On:** Strength in battle
      **Goal:** Maintaining control over the Tower
    `),
  },
  fug: {
    name: "FUG",
    emoji: emojis["fug"],
    leader: characters["khelHellam"],
    description: stripIndents(`
      FUG is the most dangerous and secretive criminal syndicate in the Tower and conduct our business in the shadows. 
      **Relies On:** Analyzing every situation
      **Goal:** Killing Zahard to overthrow his rule 
    `),
  },
  wolhaiksong: {
    name: "Wolhaiksong",
    emoji: emojis["wolhaiksong"],
    leader: characters["urekMazino"],
    description: stripIndents(`
      Wolhaiksong is an organization on the 77th Floor pushing for change in the Tower.
      **Relies On:** Instincts
      **Goal:** Finding a way out of the Tower
    `),
  },
};

module.exports = factions;
