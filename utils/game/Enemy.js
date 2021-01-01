const Item = require("./Item");

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

module.exports = { Enemy, Boss, Special };
