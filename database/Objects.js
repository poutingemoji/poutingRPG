const { expFormulas } = require("../utils/helpers/enumHelper");

const Characters = require("../docs/data/Characters");

const Parser = require("expr-eval").Parser;

const Objects = {
  updatedPlayer() {
    return {};
  },

  newPlayer(id, traits) {
    console.log(traits[0]);
    return {
      id: id,

      level: 1,
      EXP: 0,
      Max_EXP: Parser.evaluate(expFormulas["mediumslow"], { n: 2 }),

      selected_Character: "irregular",
      characters_Owned: Objects.newCharacter("irregular", traits[0]),
      inventory: {dullneedle: 4, dullspear: 2},

      energy: 120,
      updated_At: Date.now(),

      points: 0,
      dallars: 0,

      arc: 0,
      chapter: 0,
      quests: [],
      commissions: [],
    };
  },

  newCharacter(id, position) {
    console.log(id);
    const character = {
      weapon: Characters[id].weapon,

      level: 1,
      EXP: 0,
      Max_EXP: Parser.evaluate(expFormulas["slow"], { n: 2 }),
      phase: 0, 

      duplicates: 0,
    };
    if (position) character.position = position;
    return { [id]: character };
  },

  newQuest(type, goal, id, rewards, progress) {
    return {
      //defeat, fish, collect, use
      type: type,
      id: id,
      goal: goal,
      progress: progress || 0,
      rewards: rewards,
    };
  },
};

module.exports = Objects;
