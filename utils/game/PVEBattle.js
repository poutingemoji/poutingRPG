//BASE
const BaseBattle = require("../../Base/Battle");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");
const { stripIndents } = require("common-tags");

//DATA
const characters = require("../../data/characters");
const emojis = require("../../data/emojis");
const enemies = require("../../data/enemies");
const items = require("../../data/items");
const talents = require("../../data/talents");

//UTILS
const {
  battleChoices,
  isEnemy,
  isInBattle,
  responseWaitTime,
  waitingOnResponse,
} = require("../enumHelper");

const getTotalEnemies = (acc, cur) => acc.concat(cur);
const calculateTotalPower = (acc, cur) => acc + cur.HP + cur.ATK;
class PVEBattle extends aggregation(BaseBattle, BaseHelper) {
  constructor(params) {
    super(params);
    const { totalWaves } = params;
    this.totalWaves = totalWaves;
    this.waveId = 0;
    this.drops = {};
    this.header = stripIndents(`
      ${this.msg.author}
      🟩 **TEAM POWER**: ${this.team.reduce(calculateTotalPower, 0)}
      🟥 **ENEMY POWER**: ${
        this.totalWaves
          .reduce(getTotalEnemies, [])
          .reduce(calculateTotalPower, 0) / this.totalWaves.length
      }
    `);
    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.team.length > 0)
      return this.msg.reply("Your team needs to have at least one character.");
    this.msgSent = await this.msg.say(this.header);
    const res = await this.Discord.confirmation({
      msg: this.msgSent,
      author: { id: this.player.discordId },
    });
    console.log(res);
    if (!res) return;
    isInBattle.add(this.player.discordId);

    for (this.waveId; this.waveId < this.totalWaves.length; this.waveId++) {
      await this.startWave();
      if (
        this.team.length == 0 ||
        this.totalWaves[this.totalWaves.length - 1].length == 0
      )
        this.endBattle();
      if (!isInBattle.has(this.player.discordId)) break;
    }
  }

  async startWave() {
    this.wave = this.totalWaves[this.waveId];
    this.team.map((t) => (t.turnEnded = false));
    this.wave.map((e) => (e.turnEnded = false));
    this.round = 0;
    do {
      this.updateBattleMsg();
      await this.startRound();
    } while (
      isInBattle.has(this.player.discordId) &&
      this.wave.some((e) => e.HP > 0) &&
      this.team.some((t) => t.HP > 0)
    );
    console.log("======waveId ended=====");
    this.body = "";
  }

  async startRound() {
    const Battle = this;
    this.round++;
    this.body += `*Round ${this.round}*\n`;
    //Player Turn
    do {
      const res = await this.Discord.awaitResponse({
        author: { id: this.player.discordId },
        msg: this.msgSent,
        type: "message",
        removeResponses: true,
        responseWaitTime: responseWaitTime,
        filter: function (response) {
          if (!response) return;
          const args = response.content.split(" ");
          if (!args.length == 3) return;
          if (typeof battleChoices[args[1]] == null) return;
          const caster = Battle.team[args[0] - 1];
          const targeted =
            battleChoices[args[1]] == "atk"
              ? Battle.wave[args[2] - 1]
              : Battle.team[args[2] - 1];
          return (
            response.author.id == Battle.player.discordId &&
            typeof caster !== null &&
            caster.turnEnded == false &&
            typeof targeted !== null
          );
        },
      });
      if (!res) return this.escape();
      console.log(res);
      const args = res.split(" ");
      this.castTalent(args[1], {
        caster: this.team[args[0] - 1],
        targeted:
          args[1] == "atk" ? this.wave[args[2] - 1] : this.team[args[2] - 1],
        attackingTeam: this.team,
        defendingTeam: this.wave,
      });
    } while (
      this.team.some((t) => t.turnEnded == false) &&
      this.wave.some((e) => e.HP > 0) &&
      this.team.some((t) => t.HP > 0)
    );
    this.wave.map(decreaseEffectTurn);

    //Enemy Turn
    this.wave.map((e) => {
      const battleChoices = Object.keys(battleChoices);
      //prettier-ignore
      const battleChoiceId = battleChoices[Math.floor(Math.random() * battleChoices.length)];
      this.castTalent(battleChoiceId, {
        caster: e,
        targeted:
          battleChoiceId == "atk"
            ? this.team[e.target.position] ||
              this.team[Math.floor(Math.random() * this.team.length)]
            : this.wave[Math.floor(Math.random() * this.wave.length)],
        attackingTeam: this.wave,
        defendingTeam: this.team,
      });
    });
    this.team.map(decreaseEffectTurn);
    this.team.concat(this.wave).map((obj) => (obj.turnEnded = false));
    this.updateBattleMsg();
    console.log("----round ended----");
  }

  escape() {
    isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  castTalent(battleChoiceId, params) {
    console.log("talent casted");
    const battleChoice = battleChoices[battleChoiceId];
    const { caster, targeted } = params;
    caster.talents[battleChoice].cast(params);

    //prettier-ignore
    if (this.header.length + (this.body.length || 0) > this.maxLength) this.body = "";
    //prettier-ignore
    this.body += `${isEnemy(caster.id) ? "🟥" : "🟩"} ${caster.name} uses **${caster.talents[battleChoice].name}** ${talentTypes[battleChoice].emoji} on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.team.map(removeKnockedOutObjs, this);
    this.wave.map(removeKnockedOutObjs, this);
    this.updateBattleMsg();
  }

  updateBattleMsg() {
    this.header = stripIndents(`
    ${this.msg.author}
    **Your Team**
    ${this.team.map(formatBattleData, this).join("\n")}

    **[Wave ${this.waveId + 1}/${this.totalWaves.length}] Enemies**
    ${this.wave.map(formatBattleData, this).join("\n")}

    __Battle Log__
    `);
    this.msgSent
      .edit(`${this.header}\n${this.body}`)
      .then(() => this.sleep(1500));
    console.log("updated Battle Msg", waitingOnResponse);
  }

  async endBattle() {
    //prettier-ignore
    this.result = `${this.msg.author} ${this.team.length > 0 ? "wins 👑" : "loses 💀"} the battle.\n`
    if (this.team.length > 0 && this.drops) {
      this.result += "__Drops__\n";
      Object.keys(this.drops).map((dropId) => {
        dropId == "points"
          ? this.Game.addValueToPlayer(this.player, dropId, this.drops[dropId])
          : this.Game.addItem(this.player, dropId, this.drops[dropId]);
      });
      this.result += Object.keys(this.drops)
        .map((dropId) => {
          const drop = items[dropId];
          //prettier-ignore
          return `+${this.drops[dropId]} ${drop.name} ${this.Discord.emoji(drop.emoji)}`;
        })
        .join("\n");
    }
    this.msgSent.edit(this.result);
    isInBattle.delete(this.player.discordId);
    //await this.Game.addQuestProgress(this.player, "defeat", this.enemy.id, 1);
  }
}
module.exports = PVEBattle;

function formatBattleData(obj, i) {
  //prettier-ignore
  return `${i + 1}) ${this.Discord.emoji(obj.turnEnded ? "✅" : "red_cross")} ${obj.name} (${obj.HP}/${obj.maxHP} ❤️) ${
    obj.target.position !== null
      ? ` | 🎯 ${
          isEnemy(obj.id)
            ? this.team[obj.target.position].name
            : this.wave[obj.target.position].name
        }`
      : ""
  }${
    Object.keys(obj.effects).length > 0
      ? ` | ${Object.keys(obj.effects)
          .map((eff) => `${eff} (${obj.effects[eff]})`)
          .join(", ")}`
      : ""
  }`;
}

function decreaseEffectTurn(obj) {
  Object.keys(obj.effects).map((eff) => {
    obj.effects[eff] -= 1;
    if (obj.effects[eff] <= 0) delete obj.effects[eff];
  });
}

function removeKnockedOutObjs(obj, i, arr) {
  if (obj.HP > 0) return;
  this.body += `🪦 ${obj.name} was knocked out.\n`;
  arr.splice(i, 1);

  if (!obj.hasOwnProperty("drops")) return;
  for (let dropId in obj.drops) {
    if (!this.drops.hasOwnProperty(dropId)) this.drops[dropId] = 0;
    this.drops[dropId] += obj.drops[dropId];
  }
}
