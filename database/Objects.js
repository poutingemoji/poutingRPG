const pets = require('../docs/data/pets.js');
const Parser = require('expr-eval').Parser;

class Objects {
  formulas = {
    fast: 'floor(((4*n)^3)/5)',
    mediumfast: 'floor(n^3)',
    mediumslow: 'floor((6/5*n^3)-(15*n^2)+(100*n)-140)',
    slow: 'floor(((5*n)^3)/4)'
  }
  newPlayer = (playerId, family, race, position) => {
    return {
      playerId: playerId,
      family: family,
      race: race,
      position: position,
    }
  }
  newPet = (id, nickname) => {
    return {
      pet: {
        id: id,
        updatedAt: new Date(),
        nickname: nickname,
  
        level: 1, exp: 0, expMax: Parser.evaluate(this.formulas[pets[id].exprate], { n: 2 }),
        hunger: 100, hygiene: 100, fun: 100, energy: 100,
      }
    }
  }
  newWeapon = (id) => {
    return {
      weapon: {
        id: id,
        tier: 1,
      }
    }
  }
  newQuest = (objectiveType, objective, rewards) => {
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

module.exports = new Objects();
