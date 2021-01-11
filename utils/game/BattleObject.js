//DATA
const talents = require("../../data/talents");

//UTILS
const Instance = require("../../utils/game/Instance");
const Talent = require("../../utils/game/Talent");
const { clamp } = require("../../utils/Helper");

module.exports = class BattleObject extends (
  Instance
) {
  constructor(params) {
    super(params);
    const { name, talentIds, HP, ATK } = params;
    if (!talentIds) throw new Error(`${name} doesn't have any talentIds.`);
    this.talents = {};
    Object.keys(Talent).map((talentType) => {
      const talentId = talentIds[talentType.toLowerCase()];
      if (!talentId) return;
      const talent = talents[talentId];
      if (!talent) throw new Error(`${talentId} is not a valid talent.`);
      if (talent.constructor.name !== talentType)
        throw new Error(`${talentId} is not a valid ${talentType}.`);
      this.talents[talentType.toLowerCase()] = talent;
    });
    this.baseStats = {};
    if (HP) {
      this.baseStats.HP = HP 
      this.baseStats.maxHP = HP
    }
    if (ATK) this.baseStats.ATK = ATK
    this.target = { position: null, turns: 0 };
    this.effects = {};
    this.turnEnded = false;
  }

  takeDamage(amount) {
    this.HP = clamp(Math.floor(this.HP - amount), 0, this.maxHP);
  }
};
