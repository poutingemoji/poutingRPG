const pets = require('../docs/data/pets.js');
const Parser = require('expr-eval').Parser;
const { expFormulas, maxHealth, maxShinsu } = require('../utils/enumHelper')

const Objects = {

  updatedPlayer() {
    return {
    }
  },

  newPlayer(playerId, family, race, position) {
    return {
      playerId: playerId,

      family: family,
      race: race,
      irregular: Math.random() >= .1,

      position: [position],

      level: 1,
      exp: 0,
      expMax: Parser.evaluate(expFormulas['mediumslow'], { n: 2 }),

      health: maxHealth(1),
      shinsu: maxShinsu(1),
      updatedAt: Date.now(),
      
      statpoints: 0,

      baang: 0,
      myun: 0,
      soo: 0,

      durability: 0,
      speed: 0,
      physical: 0,
      
      points: 0,
      dallars: 0,

      arc: 0,
      chapter: 0,
      move: ['punch'],

      reputation: 0,
      quests: [],
      fishes: {
        ['Shrimp']: 0,
        ['Fish']: 0,
        ['Tropical Fish']: 0,
        ['Blowfish']: 0,
        ['Squid']: 0,
        ['Octopus']: 0,
        ['Metalfish']: 0,
        ['Silver Fish']: 0,
        ['Crystal Shard']: 0,
        ['Valuable Object']: 0,
        ['Baby Zygaena']: 0,
        ['Sweetfish']: 0,
        ['Boot']: 0,
        ['Brick']: 0,
        ['\nTotal Amount']: 0,
      },
    }
  },

  newTechnique(id) {
    return {
      move: {
        id: id,
        mastery: 1,
      }
    }
  },

  newPet(id) {
    return {
      pet: {
        id: id,
        updatedAt: Date.now(),
  
        level: 1, exp: 0, expMax: Parser.evaluate(expFormulas[pets[id].exprate], { n: 2 }),
        hunger: 100, hygiene: 100, fun: 100, energy: 100,
      }
    }
  },
 
  newQuest(objectiveType, objective) {
    console.log(objective)
    return {
      objectiveType: objectiveType,
      objective: {
        name: objective[0],
        goal: objective[1],
      },
      progress: 0,
      //defeat, fish, collect, train
    }
  }
}

module.exports = Objects;
