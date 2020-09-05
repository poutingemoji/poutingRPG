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
    const objectives = {
      Collect: {
        name: objective[0],
        goal: objective[1]
      },
      Defeat: {
        name: objective[0], 
        total: objective[1],
        waves: objective[2],
      },
      Fish: {
        name: objective[0],
        goal: objective[1]
      }
    }
    return {
      objectiveType: objectiveType,
      objective: objectives[objectiveType],
      progress: 0,
      rewards: rewards
    }
  }
}

module.exports = Objects;
