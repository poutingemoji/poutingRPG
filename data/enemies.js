const { Boss, Special } = require("../utils/game/Enemy");
module.exports = {
  whiteSteelEel: new Boss({
    rarity: 5,
    name: "White Steel Eel",
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
  ball: new Special({
    rarity: 1,
    name: "Ball",
    HP: 50,
    ATK: 0,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
};
