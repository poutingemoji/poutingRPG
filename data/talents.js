const { Attack, Skill, Burst, Passive } = require("../utils/game/Talent");
const { convertArrayToObject } = require("../utils/Helper");

module.exports = convertArrayToObject([
  new Attack({
    id: "foreignIronwind",
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
  new Skill({
    id: "palmVortex",
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
  new Burst({
    id: "gustSurge",
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

  //WEAPON
  new Passive({
    id: "criticalStrike",
    description: "15% chance to deal 50% bonus damage.",
    onAttack({ talent }) {
      if (!Math.random() <= 0.15) return;
      talent.bonusDMG += 0.5;
    },
  }),
  new Passive({
    id: "chainAttack",
    description:
      "30% chance to attack an additional random targeted with 20% attack power",
  }),

  new Passive({
    id: "bedtime",
    description: "5% chance to stun targeted for 1 turn",
  }),

  new Passive({
    id: "hocusPokus",
    description: "Heal by 10% of dealt damage",
  }),

  new Passive({
    id: "dispel",
    description: "20% chance to purge blessings on targeted",
  }),

  //OFFHAND
  new Passive({
    id: "vigor",
    description: "Take 5% less damage.",
    onDamaged({ amount }) {
      return amount * 0.05;
    },
  }),
  new Passive({
    id: "night",
    description: "Increase attack power by 5%",
  }),
  new Passive({
    id: "vitality",
    description: "Increase max HP by 15%",
  }),
]);

/*
EVENTS
  onStart
  onDamaged(targeted, amount)
  onAttack(talent, caster, targeted, attackingTeam, defendingTeam)
  onDefend(talent, caster, targeted, attackingTeam, defendingTeam)
*/
