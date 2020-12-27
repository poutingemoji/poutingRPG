//BASE
const Battle = require("./Battle");
const { stripIndents } = require("common-tags");
const { findBestMatch } = require("string-similarity")

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
  isInBattle,
  responseWaitTime,
  waitingOnResponse,
} = require("../enumHelper");
const enumHelper = require("../enumHelper");

const getTotalEnemies = (acc, cur) => acc.concat(cur);
const calculateTotalPower = (acc, cur) => acc + cur.HP + cur.ATK;
class PVEBattle extends Battle {
  constructor(params) {
    super(params);
    this.totalWaves = params.totalWaves.map((wave) =>
      wave.map((enemyId) =>
        this.getBattleStats(this.Game.getEnemy(this.player, enemyId))
      )
    );
    this.waveId = 0;
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
    const Battle = this;

    this.Discord.createResponseCollector({
      author: { id: this.player.discordId },
      msg: this.msgSent,
      type: "message",
      removeResponses: true,
      filter: function (response) {
        if (!response) return;
        const args = response.content.split(" ");
        if (!args.length == 2) return;
        if (args[0] !== "data") return;
        if (isNaN(args[1])) return;
        const obj =
          Math.sign(args[1]) == 1
            ? Battle.team1[args[1] - 1]
            : Battle.team2[Math.abs(args[1]) - 1];
        return typeof obj !== "undefined";
      },
      onCollect: function (message) {
        console.log("MESSAGE", message);
        const args = message.split(" ");
        const obj =
          Math.sign(args[1]) == 1
            ? Battle.team1[args[1] - 1]
            : Battle.team2[Math.abs(args[1]) - 1];
        console.log(obj);
        const messageEmbed = Battle.Discord.buildEmbed({
          name: obj.name,
          description: `yes`,
        });
        Battle.msg.say(messageEmbed);
      },
      onEnd: function (collected) {},
    });

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
    this.team1.map((t) => (t.turnEnded = false));
    this.team2.map((e) => (e.turnEnded = false));
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
          const battleChoiceId = findBestMatch(args[1], battleChoices).bestMatch.target
          const caster = Battle.team1[args[0] - 1];
          const targeted = battleChoiceId == battleChoices[0]
            ? Battle.team2[args[2] - 1]
            : Battle.team1[args[2] - 1];
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
      const battleChoiceId = findBestMatch(args[1], battleChoices).bestMatch.target
      teamKnockedOut = this.castTalent(
        battleChoiceId,
        {
          caster: this.team1[args[0] - 1],
          targeted: battleChoiceId == battleChoices[0]
            ? this.team2[args[2] - 1]
            : this.team1[args[2] - 1],
          attackingTeam: this.team1,
          defendingTeam: this.team2,
        }
      );
    } while (this.team1.some((t) => t.turnEnded == false) && !teamKnockedOut);
    if (teamKnockedOut) return;
    this.team2.map(this.decreaseEffectTurn);
    console.log("Enemy Turn");
    //Enemy Turn

    this.team2.map((e) => {
      const battleChoiceId =
        battleChoices[Math.floor(Math.random() * battleChoices.length)];
      teamKnockedOut = this.castTalent(battleChoiceId, {
        caster: e,
        targeted: battleChoices[0].includes(battleChoiceId)
          ? this.team1[e.target.position] ||
            this.team1[Math.floor(Math.random() * this.team1.length)]
          : this.team2[Math.floor(Math.random() * this.team2.length)],
        attackingTeam: this.team2,
        defendingTeam: this.team1,
      });
      this.sleep(2000);
      console.log("cast enemey turn");
    });
    if (teamKnockedOut) return;

    this.team1.map(this.decreaseEffectTurn);
    this.team1.concat(this.team2).map((obj) => (obj.turnEnded = false));
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
      ${this.team1.map(this.formatBattleStats, this).join("\n")}

      **[Wave ${this.waveId + 1}/${this.totalWaves.length}] Enemies**
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
