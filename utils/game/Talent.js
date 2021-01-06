const Instance = require("./Instance");
class Talent extends Instance {
  constructor(params) {
    super(params);
    const { turns, baseDMG, onStart, onDamaged, onAttack, onDefend } = params;
    if (turns) this.turns = turns;
    if (baseDMG) this.baseDMG = baseDMG;
    if (onStart) this.onStart = onStart;
    if (onDamaged) this.onDamaged = onDamaged;
    if (onAttack) this.onAttack = onAttack;
    if (onDefend) this.onDefend = onDefend;
  }
}

class Attack extends Talent {
  constructor(params) {
    super(params);
  }
}

class Support extends Talent {
  constructor(params) {
    super(params);
  }
}

class Passive extends Talent {
  constructor(params) {
    super(params);
  }
}

module.exports = {
  Attack,
  Support,
  Passive,
};
