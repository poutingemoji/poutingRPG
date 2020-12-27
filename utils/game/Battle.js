//BASE
const BaseHelper = require("../../Base/Helper");
const { camelCase } = require("change-case");

//DATA
const characters = require("../../data/characters");
const enemies = require("../../data/enemies");
const talents = require("../../data/talents");

//UTILS
const { itemCategories } = require("../enumHelper");

class Battle extends BaseHelper {
  constructor(params) {
    super();
    const { Discord, Game, player, msg, title = "" } = params;
    this.Discord = Discord;
    this.Game = Game;
    this.player = player;
    this.msg = msg;

    this.title = title;
    this.header = "";
    this.body = "";
    this.maxLength = 2000;

    this.team1 = this.player.teams[this.player.teamId].map((characterId) =>
      this.getBattleStats(this.Game.getCharacter(this.player, characterId))
    );
    this.team2 = [];
    /*
      this.team2 = params.team2.map((characterId) =>
        this.getBattleStats(this.Game.getCharacter(this.player2, characterId))
      );
    */
    this.drops = {};
  }

  castTalent(battleChoice, params) {
    //const casterTurnEnded = !caster.turnEnded == false;
    const teamKnockedOut = !(
      this.team2.some((e) => e.HP > 0) && this.team1.some((t) => t.HP > 0)
    );
    if (teamKnockedOut) return teamKnockedOut;

    const { caster, targeted } = params;
    const talent = caster.talents[battleChoice];
    params.talent = {
      bonusDMG: 0,
      baseDMG: talent.baseDMG + caster.ATK,
    };
    //console.log("CASTER", caster);

    if (caster.hasOwnProperty("weapon") && caster.hasOwnProperty("offhand")) {
      itemCategories.equipment.map((equipmentType) => {
        const passiveTalent = caster[equipmentType].talents.passive;
        if (passiveTalent.hasOwnProperty("onAttack"))
          passiveTalent.onAttack(params);
      });
    }
    if (
      targeted.hasOwnProperty("weapon") &&
      targeted.hasOwnProperty("offhand")
    ) {
      itemCategories.equipment.map((equipmentType) => {
        const passiveTalent = targeted[equipmentType].talents.passive;
        if (passiveTalent.hasOwnProperty("onDefend"))
          passiveTalent.onDefend(params);
      });
    }
    Object.values(caster.effects).map((eff) => {
      if (eff.hasOwnProperty("onAttack")) eff.onAttack(params);
    });
    Object.values(targeted.effects).map((eff) => {
      if (eff.hasOwnProperty("onDefend")) eff.onDefend(params);
    });

    params.talent.DMG = params.talent.baseDMG * (1 + params.talent.bonusDMG);
    talent.cast(params);

    if (this.header.length + (this.body.length || 0) > this.maxLength)
      this.body = "";
    this.body += `${this.team1.includes(caster) ? "🟩" : "🟥"} ${
      caster.name
    } uses **${caster.talents[battleChoice].name}** ${
      talents[battleChoice].emoji
    } on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.team1.map(this.removeKnockedOutObjs, this);
    this.team2.map(this.removeKnockedOutObjs, this);
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

  formatBattleStats(obj, i) {
    return `${i + 1}) ${this.Discord.emoji(
      obj.turnEnded ? "✅" : "red_cross"
    )} ${obj.name} (${obj.HP}/${obj.maxHP} ❤️) ${
      obj.target.position !== null
        ? ` | 🎯 ${
            this.team1.includes(obj)
              ? this.team1[obj.target.position].name
              : this.team2[obj.target.position].name
          }`
        : ""
    }${
      Object.values(obj.effects).length > 0
        ? ` | ${Object.values(obj.effects)
            .map((eff) => `${eff.name} (${eff.turns})`)
            .join(", ")}`
        : ""
    }`;
  }

  getBattleStats(obj) {
    const Battle = this;
    const data = Object.assign({}, obj, {
      HP: obj.baseStats.HP,
      ATK: obj.baseStats.ATK,
      target: { position: null, turns: 0 },
      effects: {},
      takeDamage: function (amount) {
        if (obj.hasOwnProperty("weapon") && obj.hasOwnProperty("offhand")) {
          itemCategories.equipment.map((equipmentType) => {
            if (obj[equipmentType].talents.passive.hasOwnProperty("onDamaged"))
              amount -=
                obj[equipmentType].talents.passive.onDamaged({
                  targeted: this,
                  amount,
                }) || 0;
          });
        }
        this.HP = Battle.clamp(Math.floor(this.HP - amount), 0, this.maxHP);
      },
      healDamage: function (amount) {
        this.HP = Battle.clamp(Math.floor(this.HP + amount), 0, this.maxHP);
      },
    });
    if (data.hasOwnProperty("weapon") && data.hasOwnProperty("offhand")) {
      data.HP += data.offhand.baseStats.HP;
      data.ATK += data.weapon.baseStats.ATK;
    }
    data.maxHP = data.HP;
    return data;
  }
}

module.exports = Battle;
