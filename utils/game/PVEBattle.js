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
const enumHelper = require("../enumHelper");
const calculateTotalPower = (acc, cur) => acc + cur.HP + cur.ATK;
class PVEBattle extends aggregation(BaseBattle, BaseHelper) {
  constructor(params) {
    super(params);
    const { totalEnemies } = params;
    this.totalEnemies = totalEnemies;
    this.wave = 0;
    this.drops = {};
    this.header = stripIndents(`
      ${this.msg.author}
      🦸‍♂️ **TEAM POWER**: ${this.team.reduce(calculateTotalPower, 0)}
      🦹‍♂️ **ENEMY POWER**: ${
        this.totalEnemies.reduce(function (acc, cur) {
          return acc + cur.reduce(calculateTotalPower, 0);
        }, 0) / this.totalEnemies.length
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
    if (!res) return;
    enumHelper.isInBattle.add(this.player.discordId);

    for (this.wave; this.wave < this.totalEnemies.length; this.wave++) {
      await this.startWave();
      if (
        this.team.length == 0 ||
        this.totalEnemies[this.totalEnemies.length - 1].length == 0
      )
        this.endBattle();
      if (!enumHelper.isInBattle.has(this.player.discordId)) break;
    }
  }

  async startWave() {
    this.enemies = this.totalEnemies[this.wave];
    this.team.map((t) => (t.turnEnded = false));
    this.enemies.map((e) => (e.turnEnded = false));
    this.round = 0;
    do {
      this.updateBattleMsg();
      await this.startRound();
    } while (
      enumHelper.isInBattle.has(this.player.discordId) &&
      this.enemies.some((e) => e.HP > 0) &&
      this.team.some((t) => t.HP > 0)
    );
    console.log("======wave ended=====");
    this.body = "";
  }

  async startRound() {
    const Battle = this;
    this.round++;
    this.body += `*Round ${this.round}*\n`;
    //Player Turn
    do {
      const res = await this.Discord.awaitResponse({
        type: "message",
        filter: function (response) {
          if (!response) return;
          const args = response.content.split(" ");
          console.log(
            Object.keys(enumHelper.battleChoices).includes(args[1]),
            args[1]
          );
          return args.length == 3 &&
            response.author.id == Battle.player.discordId &&
            Object.keys(Battle.team).includes((args[0] - 1).toString()) &&
            Object.keys(enumHelper.battleChoices).includes(args[1]) &&
            enumHelper.battleChoices[args[1]] == "atk"
            ? Object.keys(Battle.enemies).includes((args[2] - 1).toString())
            : Object.keys(Battle.team).includes((args[2] - 1).toString()) &&
                Battle.team[args[0] - 1].turnEnded == false;
        },
        msg: this.msgSent,
        author: { id: this.player.discordId },
        removeResponses: true,
      });
      if (!res) return this.escape();
      console.log(res);
      const args = res.split(" ");
      this.castTalent(args[1], {
        caster: this.team[args[0] - 1],
        targeted:
          args[1] == "atk" ? this.enemies[args[2] - 1] : this.team[args[2] - 1],
        attackingTeam: this.team,
        defendingTeam: this.enemies,
      });
    } while (
      this.team.some((t) => t.turnEnded == false) &&
      this.enemies.some((e) => e.HP > 0) &&
      this.team.some((t) => t.HP > 0)
    );
    this.enemies.map(decreaseEffectTurn);

    //Enemy Turn
    this.enemies.map((e) => {
      const battleChoices = Object.keys(enumHelper.battleChoices);
      //prettier-ignore
      const battleChoiceId = battleChoices[Math.floor(Math.random() * battleChoices.length)];
      this.castTalent(battleChoiceId, {
        caster: e,
        targeted:
          battleChoiceId == "atk"
            ? this.team[e.target.position] ||
              this.team[Math.floor(Math.random() * this.team.length)]
            : this.enemies[Math.floor(Math.random() * this.enemies.length)],
        attackingTeam: this.enemies,
        defendingTeam: this.team,
      });
    });
    this.team.map(decreaseEffectTurn);
    this.team.concat(this.enemies).map((obj) => (obj.turnEnded = false));
    this.updateBattleMsg();
    console.log("----round ended----");
  }

  escape() {
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  async endBattle() {
    //prettier-ignore
    this.result = `${this.msg.author} ${this.team.length > 0 ? "wins 👑" : "loses 💀"} the battle.\n`
    if (this.drops) {
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
    enumHelper.isInBattle.delete(this.player.discordId);
    //await this.Game.addQuestProgress(this.player, "defeat", this.enemy.id, 1);
  }

  castTalent(battleChoiceId, params) {
    console.log("talent casted");
    const battleChoice = enumHelper.battleChoices[battleChoiceId];
    const { caster, targeted } = params;
    caster.talents[battleChoice].cast(params);

    //prettier-ignore
    if (this.header.length + (this.body.length || 0) > this.maxLength) this.body = "";
    //prettier-ignore
    this.body += `${enumHelper.isEnemy(caster.id) ? "🟥" : "🟩"} ${caster.name} uses **${caster.talents[battleChoice].name}** ${enumHelper.talentTypes[battleChoice].emoji} on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.team.map(removeKnockedOutObjs, this);
    this.enemies.map(removeKnockedOutObjs, this);
    this.updateBattleMsg();
  }

  updateBattleMsg() {
    this.header = stripIndents(`
    ${this.msg.author}
    **Your Team**
    ${this.team.map(formatBattleData, this).join("\n")}

    **[Wave ${this.wave + 1}/${this.totalEnemies.length}] Enemies**
    ${this.enemies.map(formatBattleData, this).join("\n")}

    __Battle Log__
    `);
    this.msgSent
      .edit(`${this.header}\n${this.body}`)
      .then(() => this.sleep(1500));
    console.log("updated Battle Msg");
  }
}
module.exports = PVEBattle;

function formatBattleData(obj, i) {
  //prettier-ignore
  return `${i + 1}) ${obj.turnEnded ? "✅ " : `${this.Discord.emoji("red_cross")} `}${obj.name} [${obj.HP}/${obj.maxHP} ❤️] ${
    obj.target.position !== null
      ? ` | 🎯 ${
          enumHelper.isEnemy(obj.id)
            ? this.team[obj.target.position].name
            : this.enemies[obj.target.position].name
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
