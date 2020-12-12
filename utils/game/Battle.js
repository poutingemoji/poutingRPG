//BASE
const { camelCase } = require("change-case");

//DATA
const characters = require("../../data/characters");
const enemies = require("../../data/enemies");
const talents = require("../../data/talents");

//UTILS
const { isEnemy, talentTypes } = require("../enumHelper");

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

  getBattleStats(obj) {
    const data = Object.assign({}, obj, {
      HP: obj.baseStats.HP,
      ATK: obj.baseStats.ATK,
      target: { position: null, turns: 0 },
      effects: {},
      takeDamage: function (amount) {
        this.HP = Math.max(Math.floor(this.HP - amount), 0);
      },
    });
    if (data.hasOwnProperty("weapon") && data.hasOwnProperty("offhand")) {
      data.HP += data.offhand.baseStats.HP
      data.ATK += data.weapon.baseStats.ATK;
    }
    data.maxHP = data.HP;
    return data;
  }

  castTalent(battleChoice, params) {
    const { caster, targeted } = params;
    const talent = caster.talents[battleChoice];
    params.talent = {
      bonusDMG: 0,
      baseDMG: talent.baseDMG + caster.ATK,
    };
    console.log("DAMAGE ", params.talent.baseDMG);
    caster.weapon.
    Object.values(caster.effects).map((eff) => {
      if (eff.hasOwnProperty("onAttack")) eff.onAttack(params);
    });
    Object.values(targeted.effects).map((eff) => {
      if (eff.hasOwnProperty("onDefend")) eff.onDefend(params);
    });
    params.talent.DMG = params.talent.baseDMG * (1 + params.talent.bonusDMG);
    talent.cast(params);
    delete params.talent;
    if (this.header.length + (this.body.length || 0) > this.maxLength)
      this.body = "";
    this.body += `${isEnemy(caster.id) ? "🟥" : "🟩"} ${caster.name} uses **${
      caster.talents[battleChoice].name
    }** ${talentTypes[battleChoice].emoji} on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.team.map(this.removeKnockedOutObjs, this);
    this.wave.map(this.removeKnockedOutObjs, this);
    this.updateBattleMsg();
  }

  decreaseEffectTurn(obj) {
    Object.entries(obj.effects).map((eff) => {
      eff[1].turns -= 1;
      if (eff[1].turns <= 0) delete obj.effects[eff[0]];
    });
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
