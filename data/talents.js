const talents = {
  attack: {
    emoji: "💥",
    slash: {
      name: "Slash",
      description:
        "Deals damage to target enemy; Forces target to attack you for 3 turns.",
      turns: 3,
      baseDMG: 30,
      cast({ talent, caster, targeted, attackingTeam }) {
        targeted.takeDamage(talent.DMG);
        targeted.target.position = attackingTeam.indexOf(caster);
        targeted.target.turns = this.turns;
      },
    },
    shinsuBlast: {
      name: "Shinsu Blast",
      description: "Deals damage to all enemies.",
      baseDMG: 10,
      cast({ talent, defendingTeam }) {
        defendingTeam.map((obj) => obj.takeDamage(talent.DMG));
      },
    },
    /*
    healingStrike: {
      name: "Healing Strike",
      description: "Deals [n] damage; Heals team by 20% of dealt damage.",
      baseDMG: 20,
      cast({ caster, targeted, attackingTeam, defendingTeam, damage }) {
        targeted.takeDamage(damage);
        attackingTeam.map((obj) => obj.healDamage((0.2 * damage) / attackingTeam.length));
      },
    },
    pummel: {
      name: "Pummel",
      description: "Deals [n] damage.",
      baseDMG: 35,
      cast({ caster, targeted, attackingTeam, defendingTeam, damage }) {
        targeted.HP -= damage;
      },
    },
    ["Itching Powder"]: function () {
      //Immediately removes all helpful effects from targeted; Deals 100 damage.
    },*/
  },
  support: {
    emoji: "🤝",
    protect: {
      name: "Protect",
      description: "Target receives 55% less damage; Lasts 2 turns.",
      turns: 2,
      cast({ targeted }) {
        targeted.effects[this.name] = Object.assign({}, this);
      },
      onDefend({ talent }) {
        talent.bonusDMG -= 0.55;
      },
    },
    shinsuAura: {
      name: "Shinsu Aura",
      description:
        "Enemies attacking the target take moderate damage; Lasts 3 turns.",
      turns: 3,
      cast({ targeted }) {
        targeted.effects[this.name] = Object.assign({}, this);
      },
    },
    /*
    ["Healing Shield"]: function () {
      //If any teammate takes damage, all teammates are healed by 15% of the taken damage; Lasts 3 turns.
    },
    ["Arrr!"]: function () {
      //All teammates’ attack power is increased by 25%; Lasts 3 turns.
    },
    ["Cheer"]: function () {
      //100% chance to remove harmful effects from all teammates; All teammates’ attack power is increased by 15%; Lasts 3 turns.
    },*/
  },
  passive: {
    emoji: "🕊️",
    //WEAPON
    criticalStrike: {
      name: "Critical Strike",
      description: "15% chance to deal 50% bonus damage.",
      onAttack({ talent }) {
        if (!Math.random() <= 0.15) return;
        talent.bonusDMG += 0.50;
      },
    },
    ["Chain Attack"]: function () {
      //30% chance to attack an additional random targeted with 20% attack power
    },
    ["Bedtime"]: function () {
      //5% chance to stun targeted for 1 turn
    },
    ["Hocus Pokus"]: function () {
      //Heal by 10% of dealt damage
    },
    ["Dispel"]: function () {
      //20% chance to purge blessings on targeted
    },

    //Off-Hand
    vigor: {
      name: "Vigor",
      description: "Take 5% less damage.",
      onDamaged({ amount }) {
        return amount * 0.05;
      },
    },
    ["Might"]: function () {
      //Increase attack power by 5%
    },
    ["Vitality"]: function () {
      //Increase max HP by 15%
    },
  },
};

module.exports = talents;

/*
EVENTS
  onDamaged(targeted, amount)
  onAttack(talent, caster, targeted, attackingTeam, defendingTeam)
  onDefend(talent, caster, targeted, attackingTeam, defendingTeam)
*/