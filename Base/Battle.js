//BASE
const { camelCase } = require("change-case");

//DATA
const characters = require("../data/characters");
const enemies = require("../data/enemies");
const talents = require("../data/talents")

//UTILS
const {
  isEnemy,
  talentTypes
} = require("../utils/enumHelper");

class Battle {
  constructor(params) {
    const { player, msg, Discord, Game, team } = params;
    this.player = player;
    this.msg = msg;
    this.Discord = Discord;
    this.Game = Game;
    this.team = team;
    
    this.rewards = {};

    this.body = "";
    this.maxLength = 2000;
  }

  castTalent(battleChoice, params) {
    const { caster, targeted } = params;
    const talent = caster.talents[battleChoice]
    console.log(talent, battleChoice)

    params.damage = talent.baseDMG || 0 + caster.ATK
    console.log("PARAMS", params)
    console.log("DAMAGE ", params.damage)
    Object.values(caster.effects).map(eff => {
      if (eff.hasOwnProperty("onAttack")) eff.onAttack(params)
    })
    Object.values(targeted.effects).map(eff => {
      if (eff.hasOwnProperty("onDefend")) eff.onDefend(params)
      console.log("DAMAGE ", params.damage)
    })

    talent.cast(params)

    if (this.header.length + (this.body.length || 0) > this.maxLength)
      this.body = "";
    this.body += `${isEnemy(caster.id) ? "🟥" : "🟩"} ${caster.name} uses **${caster.talents[battleChoice].name}** ${talentTypes[battleChoice].emoji} on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.team.map(this.removeKnockedOutObjs, this);
    this.wave.map(this.removeKnockedOutObjs, this);
    this.updateBattleMsg();
  }

  decreaseEffectTurn(obj) {
    Object.values(obj.effects).filter((eff) => {
      eff.turns -= 1
      return eff.turns > 0
    })
  }

  removeKnockedOutObjs(obj, i, arr) {
    if (obj.HP > 0) return;
    this.body += `🪦 ${obj.name} was knocked out.\n`;
    arr.splice(i, 1);
  
    if (!obj.hasOwnProperty("drops")) return;
    for (let dropId in obj.drops) {
      if (!this.drops.hasOwnProperty(dropId)) this.drops[dropId] = 0;
      this.drops[dropId] += obj.drops[dropId];
    }
  }
}

module.exports = Battle;



