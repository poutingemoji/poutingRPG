//BASE
const Battle = require("./Battle");
const { stripIndents } = require("common-tags");
const { findBestMatch } = require("string-similarity");

//DATA
const characters = require("../../data/characters");
const emojis = require("../../data/emojis");
const enemies = require("../../data/enemies");
const items = require("../../data/items");
const talents = require("../../data/talents");

//UTILS
const {
  battleChoices,
  isInBattle,
  waitingOnResponse,
} = require("../enumHelper");
const { randomChoice,  sleep } = require("../Helper");

const getTotalEnemies = (acc, cur) => acc.concat(cur);
const calculateTotalPower = (acc, cur) =>
  acc + cur.baseStats.HP || 0 + cur.baseStats.ATK || 0;

module.exports = class PVEBattle extends (
  Battle
) {
  constructor(params) {
    super(params);
    this.totalWaves = params.totalWaves.map((wave) =>
      wave.map((enemyId) => this.Game.getObjectStats(this.player, enemyId))
    );
    this.waveId = 0;
    console.log("TEAMS", this.team1, this.totalWaves);
    this.header = stripIndents(`
      ${this.msg.author}
      ${this.title} Battle
      🟩 **TEAM POWER**: ${this.team1.reduce(calculateTotalPower, 0)}
      🟥 **ENEMY POWER**: ${
        this.totalWaves
          .reduce(getTotalEnemies, [])
          .reduce(calculateTotalPower, 0) / this.totalWaves.length
      }
    `);
    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.team1.length > 0)
      return this.msg.reply("Your team needs to have at least one character.");
    this.msgSent = await this.msg.say(this.header);
    const res = await this.Discord.confirmation({
      msg: this.msgSent,
      author: { id: this.player.discordId },
    });
    console.log(res);
    if (!res) return;
    isInBattle.add(this.player.discordId);

    this.team2 = this.totalWaves[this.waveId];
    for (this.waveId; this.waveId < this.totalWaves.length; this.waveId++) {
      await this.startWave();
      if (
        this.team1.length == 0 ||
        this.totalWaves[this.totalWaves.length - 1].length == 0
      )
        this.endBattle();
      if (!isInBattle.has(this.player.discordId)) break;
    }
  }

  async startWave() {
    this.team2 = this.totalWaves[this.waveId];
    this.round = 0;
    do {
      this.updateBattleMsg();
      await this.startRound();
    } while (
      isInBattle.has(this.player.discordId) &&
      this.team2.some((e) => e.HP > 0) &&
      this.team1.some((t) => t.HP > 0)
    );
    console.log("======waveId ended=====");
    this.body = "";
  }

  async startRound() {
    const Battle = this;
    this.round++;
    this.body += `*Round ${this.round}*\n`;
    //Player Turn
    let teamKnockedOut;

    this.team2.map(this.decreaseEffectTurn);
    console.log("Enemy Turn");
    //Enemy Turn

    let attackingTeam = this.team1,
      defendingTeam = this.team2;
    const teams = [attackingTeam, defendingTeam]
    teams.map((team => {
      team.map((caster => {
        const battleChoiceId = randomChoice(battleChoices);
        teamKnockedOut = this.castTalent(battleChoiceId, {
          caster,
          targeted: battleChoices[0].includes(battleChoiceId)
            ? defendingTeam[caster.target.position] || randomChoice(defendingTeam)
            : randomChoice(this.team2),
          attackingTeam,
          defendingTeam,
        });
        sleep(2000);
        if (teamKnockedOut) return;
        console.log("Next turn");
        defendingTeam.map(this.decreaseEffectTurn);
        defendingTeam = [attackingTeam, (attackingTeam = defendingTeam)][0];
      }))
    }))
      
    teams.map(team => team.map((entity) => (entity.turnEnded = false)));
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
      __Your Team__
      ${this.team1.map(this.formatBattleStats, this).join("\n")}

      __[Wave ${this.waveId + 1}/${this.totalWaves.length}] Enemies__
      ${this.team2.map(this.formatBattleStats, this).join("\n")}

      __Battle Log__
    `);
    this.msgSent.edit(`${this.header}\n${this.body}`);
    console.log("updated Battle Msg", waitingOnResponse);
  }

  async endBattle() {
    //prettier-ignore
    this.result = `${this.msg.author} ${this.team1.length > 0 ? "wins 👑" : "loses 💀"} the battle.\n`
    if (this.team1.length > 0 && this.drops) {
      this.result += "**Obtained**\n";
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
};
