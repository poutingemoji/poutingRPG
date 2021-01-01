const Entity = require("./_Entity");

class Enemy extends Entity {
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

module.exports = { Boss, Special };
