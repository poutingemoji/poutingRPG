const BattleObject = require("./BattleObject");

class Enemy extends BattleObject {
  constructor(params) {
    super(params);
    const { drops } = params;
    if (drops) this.drops = drops;
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

module.exports = { Boss, Special };
