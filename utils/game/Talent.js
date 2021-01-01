class Talent {
  constructor({
    name,
    description = "",
    turns,
    baseDMG,
    onStart,
    onDamaged,
    onAttack,
    onDefend,
  }) {
    this.name = name;
    this.description = description;
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
  emoji = "🗡️";
}

class Support extends Talent {
  constructor(params) {
    super(params);
  }
  emoji = "🤝";
}

class Passive extends Talent {
  constructor(params) {
    super(params);
  }
  passive = "🕊️";
}

module.exports = {
  Talent,
  Attack,
  Support,
  Passive,
};
