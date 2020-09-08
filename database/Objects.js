const pets = require('../docs/data/pets.js');
const Parser = require('expr-eval').Parser;
const enumHelper = require('../utils/enumHelper')

const Objects = {
  newPlayer(playerId, family, race, position) {
    return {
      playerId: playerId,
      family: family,
      race: race,
      position: [position],
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
      },
      quests: {},
    }
  },
  newPet(id, nickname) {
    return {
      pet: {
        id: id,
        updatedAt: Date.now(),
        nickname: nickname,
  
        level: 1, exp: 0, expMax: Parser.evaluate(enumHelper.expFormulas[pets[id].exprate], { n: 2 }),
        hunger: 100, hygiene: 100, fun: 100, energy: 100,
      }
    }
  },
  newWeapon(id) {
    return {
      weapon: {
        id: id,
        tier: 1,
      }
    }
  },
  newQuest(objectiveType, objective, rewards) {
    console.log(objective)
    return {
      objectiveType: objectiveType,
      objective: {
        name: objective[0],
        goal: objective[1],
      },
      progress: 0,
      rewards: rewards
      //defeat, fish, collect, train
    }
  }
}

module.exports = Objects;
