//BASE
const Battle = require("./Battle");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../data/arcs");
const characters = require("../../data/characters");
const emojis = require("../../data/emojis");
const enemies = require("../../data/enemies");
const floors = require("../../data/floors");
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
const enumHelper = require("../enumHelper");

const getTotalEnemies = (acc, cur) => acc.concat(cur);
const calculateTotalPower = (acc, cur) => acc + cur.HP + cur.ATK;
class PVEBattle extends aggregation(Battle, BaseHelper) {
  constructor(params) {
    super(params);

    this.totalWaves = [];
    const towerProgression = this.player.progression.tower;
    floors[towerProgression.floor].areas[towerProgression.area].waves.map(
      (wave) => {
        const enemiesInWave = [];
        for (const enemyId in wave) {
          console.log("BATTLE",this.getBattleStats(this.Game.getEnemy(this.player, enemyId)))
          this.fillArray(
            this.getBattleStats(this.Game.getEnemy(this.player, enemyId)),
            wave[enemyId],
            enemiesInWave
          );
          console.log("HERE")
        }
        this.totalWaves.push(enemiesInWave);
      }
    );
    this.team = Object.values(this.player.teams[this.player.teamId]).map((t) =>
      this.getBattleStats(this.Game.getCharacter(this.player, t))
    );

    this.waveId = 0;
    this.drops = {};
    console.log(this.totalWaves)
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
          if (
            !battleChoices.find((battleChoiceId) =>
              battleChoiceId.includes(args[1])
            )
          )
            return;
          const caster = Battle.team[args[0] - 1];
          const targeted = battleChoices[0].includes(args[1])
            ? Battle.wave[args[2] - 1]
            : Battle.team[args[2] - 1];
          return (
            response.author.id == Battle.player.discordId &&
            typeof caster !== "undefined" &&
            caster.turnEnded == false &&
            typeof targeted !== "undefined"
          );
        },
      });
      if (!res) return this.escape();
      console.log(res);
      const args = res.split(" ");
      this.castTalent(
        battleChoices.find((battleChoiceId) =>
          battleChoiceId.includes(args[1])
        ),
        {
          caster: this.team[args[0] - 1],
          targeted: battleChoices[0].includes(args[1])
            ? this.wave[args[2] - 1]
            : this.team[args[2] - 1],
          attackingTeam: this.team,
          defendingTeam: this.wave,
        }
      );
    } while (
      this.team.some((t) => t.turnEnded == false) &&
      this.wave.some((e) => e.HP > 0) &&
      this.team.some((t) => t.HP > 0)
    );
    if (!(this.wave.some((e) => e.HP > 0) && this.team.some((t) => t.HP > 0)))
      return;
    this.wave.map(this.decreaseEffectTurn);
    console.log("Enemy Turn");
    //Enemy Turn

    this.wave.map(async (e) => {
      const battleChoiceId =
        battleChoices[Math.floor(Math.random() * battleChoices.length)];
      this.castTalent(battleChoiceId, {
        caster: e,
        targeted: battleChoices[0].includes(battleChoiceId)
          ? this.team[e.target.position] ||
            this.team[Math.floor(Math.random() * this.team.length)]
          : this.wave[Math.floor(Math.random() * this.wave.length)],
        attackingTeam: this.wave,
        defendingTeam: this.team,
      });
      await this.sleep(2000);
      console.log("cast enemey turn");
    });

    this.team.map(this.decreaseEffectTurn);
    this.team.concat(this.wave).map((obj) => (obj.turnEnded = false));
    this.updateBattleMsg();
    console.log("----round ended----");
  }

  escape() {
    isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  async updateBattleMsg() {
    this.header = stripIndents(`
      ${this.msg.author}
      **Your Team**
      ${this.team.map(formatBattleData, this).join("\n")}

      **[Wave ${this.waveId + 1}/${this.totalWaves.length}] Enemies**
      ${this.wave.map(formatBattleData, this).join("\n")}

      __Battle Log__
    `);
    this.msgSent.edit(`${this.header}\n${this.body}`);
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
    Object.values(obj.effects).length > 0
      ? ` | ${Object.values(obj.effects)
          .map((eff) => `${eff.name} (${eff.turns})`)
          .join(", ")}`
      : ""
  }`;
}
