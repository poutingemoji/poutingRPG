const enumHelper = require("../../utils/enumHelper");
const talents = {
  /*
    COMBAT TALENTS
  */

  //ATTACK
  ["Attack"]: function (params) {
    const { caster, target, team, enemies, getDescription, getType } = params;
    this.baseDMG = 30;
    const n = caster ? calculateAttackDMG(this.baseDMG, caster.ATK) : this.baseDMG;
    this.type = "Attack";
    this.description = `Deals __${n}__ damage; Forces target to attack ${caster.name} for 3 turns.`
    
    const data = {};
    if (getDescription) data.description = this.description
    if (getType) data.type = this.type
    if (getDescription || getType) return data;

    target.HP -= n;
    //prettier-ignore
    target.target.position = enumHelper.isEnemy(caster.name) ? enemies.indexOf(caster) : team.indexOf(caster)
    target.target.turns = 3
    return {
      team,
      enemies,
    };
  },
  ["Storm"]: function (params) {
    const { caster, target, team, enemies, getDescription, getType } = params;
    this.baseDMG = 10;
    const n = caster ? calculateAttackDMG(this.baseDMG, caster.ATK) : this.baseDMG;
    this.type = "Attack";
    this.description = `Deals __${n}__ damage to all enemies.`

    const data = {};
    if (getDescription) data.description = this.description
    if (getType) data.type = this.type
    if (getDescription || getType) return data;

    enemies.map(e => e.HP -= n)
    return {
      team,
      enemies,
    };
  },
  ["Healing Strike"]: function (params) {
    const { caster, target, team, enemies, getDescription, getType } = params;
    this.baseDMG = 20;
    const n = caster ? calculateAttackDMG(this.baseDMG, caster.ATK) : this.baseDMG;
    this.type = "Attack";
    this.description = `Deals __${n}__ damage; Heals team by 20% of dealt damage.`

    const data = {};
    if (getDescription) data.description = this.description
    if (getType) data.type = this.type
    if (getDescription || getType) return data;

    target.HP -= n;
    team.map((t) => t.HP + (0.2 * n) / team.length);
    return {
      team,
      enemies,
    };
  },
  ["Pummel"]: function (params) {
    const { caster, target, team, enemies, getDescription, getType } = params;
    this.baseDMG = 35;
    const n = caster ? calculateAttackDMG(this.baseDMG, caster.ATK) : this.baseDMG;
    this.type = "Attack";
    this.description = `Deals __${n}__ damage.`

    const data = {};
    if (getDescription) data.description = this.description
    if (getType) data.type = this.type
    if (getDescription || getType) return data;

    target.HP -= n;
    return {
      team,
      enemies,
    };
  },
  ["Itching Powder"]: function () {
    //Immediately removes all helpful effects from target; Deals 100 damage.
  },

  //DEFEND
  ["Protect"]: function () {
    //Target receives 55% less damage; Lasts 2 turns.
  },
  ["Shock Shield"]: function () {
    //Enemies attacking the target receive 75 damage per attack; Lasts 3 turns.
  },
  ["Healing Shield"]: function () {
    //If any teammate takes damage, all teammates are healed by 15% of the taken damage; Lasts 3 turns.
  },
  ["Arrr!"]: function () {
    //All teammates’ attack power is increased by 25%; Lasts 3 turns.
  },
  ["Cheer"]: function () {
    //100% chance to remove harmful effects from all teammates; All teammates’ attack power is increased by 15%; Lasts 3 turns.
  },

  //PASSIVE

  /*
    EQUIPMENT TALENTS
  */

  //WEAPON
  ["Critical Strike"]: function () {
    //15% chance to deal 50% bonus damage
  },
  ["Chain Attack"]: function () {
    //30% chance to attack an additional random target with 20% attack power
  },
  ["Bedtime"]: function () {
    //5% chance to stun target for 1 turn
  },
  ["Hocus Pokus"]: function () {
    //Heal by 10% of dealt damage
  },
  ["Dispel"]: function () {
    //20% chance to purge blessings on target
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
};

module.exports = talents;

function calculateAttackDMG(baseDMG, ATK) {
  return baseDMG + ATK;
}
