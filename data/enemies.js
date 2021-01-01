const { Boss, Special } = require("../utils/game/Enemy");
const enemies = {
  whiteSteelEel: new Boss({
    rarity: 5,
    name: "White Steel Eel",
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
  ball: new Special({
    rarity: 1,
    name: "Ball",
    HP: 50,
    ATK: 0,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
};

module.exports = enemies;
