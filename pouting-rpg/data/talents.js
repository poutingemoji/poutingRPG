const talents = {
  //prettier-ignore
  /*
    COMBAT TALENTS
  */

  //ATTACK
  ["Attack"]: function() {
    //Deals 115 damage; Forces target to attack Red for 3 turns.
  },
  ["Storm"]: function() {
    //Deals 55 damage to all enemies.
  },
  ["Healing Strike"]: function() {
    //Deals 100 damage; Heals all birds by 20% of dealt damage.
  },
  ["Pummel"]: function() {
    //Deals 100 damage.
  },
  ["Itching Powder"]: function() {
    //Immediately removes all helpful effects from target; Deals 100 damage.
  },

  //DEFEND
  ["Protect"]: function() {
    //Target receives 55% less damage; Lasts 2 turns.
  },
  ["Shock Shield"]: function() {
    //Enemies attacking the target receive 75 damage per attack; Lasts 3 turns.
  },
  ["Healing Shield"]: function() {
    //If any bird takes damage, all birds are healed by 15% of the taken damage; Lasts 3 turns.
  },
  ["Arrr!"]: function() {
    //All birds’ attack power is increased by 25%; Lasts 3 turns.
  },
  ["Cheer"]: function() {
    //100% chance to remove harmful effects from all birds; All birds’ attack power is increased by 15%; Lasts 3 turns.
  },

  //PASSIVE


  /*
    EQUIPMENT TALENTS
  */

  //WEAPON
  ["Critical Strike"]: function() {
    //15% chance to deal 50% bonus damage
  },
  ["Chain Attack"]: function() {
    //30% chance to attack an additional random target with 20% attack power
  },
  ["Bedtime"]: function() {
    //5% chance to stun target for 1 turn
  },
  ["Hocus Pokus"]: function() {
    //Heal by 10% of dealt damage
  },
  ["Dispel"]: function() {
    //20% chance to purge blessings on target
  },

  //Off-Hand
  ["Vigor"]: function() {
    //Take 5% less damage
  },
  ["Might"]: function() {
    //Increase attack power by 5%
  },
  ["Vitality"]: function() {
    //Increase max HP by 15%
  },
}

module.exports = talents;