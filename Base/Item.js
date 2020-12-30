const talents = require("../data/talents")
const { rarities } = require("../utils/enumHelper")
class Item {
  constructor({ rarity, name, emoji = "", description = "", HP, ATK, attackId, supportId, passiveId}) {
    if (!rarities[rarity - 1])
      return console.error(`${name}'s rarity, ${rarity}, is illegal.`);
    this.name = name;
    this.emoji = emoji;
    this.description = description;
    this.rarity = rarity;

    this.level = 1;
    this.weight = 1.0;
    this.spread = 1;

    this.baseStats = {}
    if (HP) this.baseStats.HP = HP
    if (ATK) this.baseStats.ATK = ATK
    this.talents = {}
    const talentTypes = Object.keys(talents)
    const talentIds = [attackId,supportId,  passiveId]
    talentIds.map((talentId, i) => {
      const talentType = talentTypes[i]
      if (!talentId) return;
      if (!talents[talentType][talentId]) return console.error(`${name}'s ${talentType}, ${talentId}, is illegal.`);
      this.talents[talentType] = talents[talentType][talentId]
    }, this)
  }
}

module.exports = Item;
