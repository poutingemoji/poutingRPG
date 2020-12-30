const Item = require("../Base/Item");
const talents = require("./talents");

class Enemy extends Item {
  constructor(params) {
    super(params);
    if (params.drops) this.drops = params.drops;
  }
}

class Boss extends Enemy {
  constructor(params) {
    super(params);
  }
}

class Special extends Enemy {
  constructor(params) {
    super(params);
  }
}

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
