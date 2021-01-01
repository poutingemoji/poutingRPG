const { Attack, Support, Passive } = require("../utils/game/Talent");
const talents = {
  slash: new Attack({
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
  }),
  shinsuBlast: new Attack({
    name: "Shinsu Blast",
    description: "Deals damage to all enemies.",
    baseDMG: 10,
    cast({ talent, defendingTeam }) {
      defendingTeam.map((obj) => obj.takeDamage(talent.DMG));
    },
  }),
  healingStrike: new Attack({
    name: "Healing Strike",
    description: "Deals n damage; Heals team by 20% of dealt damage.",
    baseDMG: 20,
    cast({ caster, targeted, attackingTeam, defendingTeam, damage }) {
      targeted.takeDamage(damage);
      attackingTeam.map((obj) =>
        obj.healDamage((0.2 * damage) / attackingTeam.length)
      );
    },
  }),
  pummel: new Attack({
    name: "Pummel",
    description: "Deals n damage.",
    baseDMG: 35,
    cast({ caster, targeted, attackingTeam, defendingTeam, damage }) {
      targeted.HP -= damage;
    },
  }),
  itchingPowder: new Attack({
    name: "Itching Powder",
    description:
      "Immediately removes all helpful effects from targeted; Deals 100 damage.",
  }),

  protect: new Support({
    name: "Protect",
    description: "Target receives 55% less damage; Lasts 2 turns.",
    turns: 2,
    cast({ targeted }) {
      targeted.effects[this.name] = Object.assign({}, this);
    },
    onDefend({ talent }) {
      talent.bonusDMG -= 0.55;
    },
  }),

  shinsuAura: new Support({
    name: "Shinsu Aura",
    description:
      "Enemies attacking the target take moderate damage; Lasts 3 turns.",
    turns: 3,
    cast({ targeted }) {
      targeted.effects[this.name] = Object.assign({}, this);
    },
  }),

  healingShield: new Support({
    name: "Healing Shield",
    description:
      "If any teammate takes damage, all teammates are healed by 15% of the taken damage; Lasts 3 turns.",
    cast({ targeted }) {},
  }),

  arrr: new Support({
    name: "Arrr!",
    description:
      "All teammates’ attack power is increased by 25%; Lasts 3 turns.",
    cast({ targeted }) {},
  }),

  cheer: new Support({
    name: "Cheer",
    description:
      "100% chance to remove harmful effects from all teammates; All teammates’ attack power is increased by 15%; Lasts 3 turns.",
    cast({ targeted }) {},
  }),

  //WEAPON
  criticalStrike: new Passive({
    name: "Critical Strike",
    description: "15% chance to deal 50% bonus damage.",
    onAttack({ talent }) {
      if (!Math.random() <= 0.15) return;
      talent.bonusDMG += 0.5;
    },
  }),
  chainAttack: new Passive({
    name: "Chain Attack",
    description:
      "30% chance to attack an additional random targeted with 20% attack power",
  }),

  bedtime: new Passive({
    name: "Bedtime",
    description: "5% chance to stun targeted for 1 turn",
  }),

  hocusPokus: new Passive({
    name: "Hocus Pokus",
    description: "Heal by 10% of dealt damage",
  }),

  dispel: new Passive({
    name: "Dispel",
    description: "20% chance to purge blessings on targeted",
  }),

  //OFFHAND
  vigor: new Passive({
    name: "Vigor",
    description: "Take 5% less damage.",
    onDamaged({ amount }) {
      return amount * 0.05;
    },
  }),
  might: new Passive({
    name: "Might",
    description: "Increase attack power by 5%",
  }),
  vitality: new Passive({
    name: "Vitality",
    description: "Increase max HP by 15%",
  }),
};

module.exports = talents;

/*
EVENTS
  onStart
  onDamaged(targeted, amount)
  onAttack(talent, caster, targeted, attackingTeam, defendingTeam)
  onDefend(talent, caster, targeted, attackingTeam, defendingTeam)
*/
