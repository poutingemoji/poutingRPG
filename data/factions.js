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
      The Empire has the most military power and influence in the Tower and administers the floor tests.
      **Relies On:** Strength in battle
      **Goal:** Maintaining control over the Tower
    `),
  },
  FUG: {
    name: "FUG",
    emoji: emojis["FUG"],
    leader: characters["khelHellam"],
    description: stripIndents(`
      They are the most dangerous and secretive criminal syndicate in the Tower and conduct their business in the shadows. 
      **Relies On:** Analyzing every situation
      **Goal:** Killing Zahard to overthrow his rule 
    `),
  },
  wolhaiksong: {
    name: "Wolhaiksong",
    emoji: emojis["wolhaiksong"],
    leader: characters["urekMazino"],
    description: stripIndents(`
      They are an organization in the Tower whose liberal movements clash against the Empire's conservative practices.
      **Relies On:** Instincts
      **Goal:** Finding a way out of the Tower
    `),
  },
};

module.exports = factions;
