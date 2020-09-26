const { expFormulas, maxHealth, maxEnergy } = require("../utils/helpers/enumHelper");

const pets = require("../docs/data/pets.js");

const Parser = require("expr-eval").Parser;

const Objects = {
  updatedPlayer() {
    return {};
  },

  newPlayer(playerId, family, race, position) {
    return {
      playerId: playerId,

      family: family,
      race: race,
      irregular: Math.random() >= 0.1,

      position: [position],

      level: 1,
      exp: 0,
      expMax: Parser.evaluate(expFormulas["mediumslow"], { n: 2 }),

      health: maxHealth(1),
      energy: maxEnergy(1),
      updatedAt: Date.now(),

      statpoints: 0,

      shinsu: 0,
      sword: 0,
      strength: 0,
      durability: 0,
      speed: 0,
      
      points: 0,
      dallars: 0,

      arc: 0,
      chapter: 0,
      move: ["punch"],

      reputation: 0,
      quests: [],
      fishes: {
        ["Shrimp"]: 0,
        ["Fish"]: 0,
        ["Tropical Fish"]: 0,
        ["Blowfish"]: 0,
        ["Squid"]: 0,
        ["Octopus"]: 0,
        ["Metalfish"]: 0,
        ["Silver Fish"]: 0,
        ["Crystal Shard"]: 0,
        ["Valuable Object"]: 0,
        ["Baby Zygaena"]: 0,
        ["Sweetfish"]: 0,
        ["Boot"]: 0,
        ["Brick"]: 0,
        ["\nTotal Amount"]: 0,
      },
    };
  },

  newMove(id) {
    return {
      move: [id],
    };
  },

  newPet(id) {
    return {
      pet: {
        id: id,
        updatedAt: Date.now(),

        level: 1,
        exp: 0,
        expMax: Parser.evaluate(expFormulas[pets[id].exprate], { n: 2 }),
        hunger: 100,
        hygiene: 100,
        fun: 100,
        energy: 100,
        nickname: "",
      },
    };
  },

  newQuest(type, goal, id, progress) {
    return {
      //defeat, fish, collect, use
      type: type,
      id: id,
      goal: goal,
      progress: progress || 0,
    };
  },
};

module.exports = Objects;
