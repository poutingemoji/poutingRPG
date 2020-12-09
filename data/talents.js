const talents = {
  attack: {
    slash: {
      name: "Slash",
      description:
        "Deals damage to target enemy; Forces target to attack you for 3 turns.",
      baseDMG: 30,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        const n = calculateAttackDMG(this.baseDMG, caster.ATK)
        targeted.takeDamage(n);
        //prettier-ignore
        targeted.target.position = attackingTeam.indexOf(caster)
        targeted.target.turns = 3;
      },
    },
    shinsuBlast: {
      name: "Shinsu Blast",
      description: "Deals damage to all enemies.",
      baseDMG: 10,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        const n = calculateAttackDMG(this.baseDMG, caster.ATK)
        defendingTeam.map((e) => (e.takeDamage(n)));
      },
    },
    /*
    healingStrike: {
      name: "Healing Strike",
      description: "Deals [n] damage; Heals team by 20% of dealt damage.",
      baseDMG: 20,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        const n = calculateAttackDMG(this.baseDMG, caster.ATK)
        targeted.HP -= n;
        attackingTeam.map((t) => t.HP + (0.2 * n) / attackingTeam.length);
      },
    },
    pummel: {
      name: "Pummel",
      description: "Deals [n] damage.",
      baseDMG: 35,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        const n = calculateAttackDMG(this.baseDMG, caster.ATK)
        targeted.HP -= n;
      },
    },
    ["Itching Powder"]: function () {
      //Immediately removes all helpful effects from targeted; Deals 100 damage.
    },*/
  },
  support: {
    protect: {
      name: "Protect",
      description: "Target receives 55% less damage; Lasts 2 turns.",
      turns: 2,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        console.log(this)
        targeted.effects[this.name] = this.turns;
      },
    },
    shinsuAura: {
      name: "Shinsu Aura",
      description:
        "Enemies attacking the target take moderate damage; Lasts 3 turns.",
      turns: 3,
      cast({ caster, targeted, attackingTeam, defendingTeam }) {
        targeted.effects[this.name] = this.turns;
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
    //EQUIPMENT TALENTS

    //WEAPON
    ["Critical Strike"]: function () {
      //15% chance to deal 50% bonus damage
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
    ["Vigor"]: function () {
      //Take 5% less damage
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

function calculateAttackDMG(baseDMG, ATK) {
  return baseDMG + ATK;
}
