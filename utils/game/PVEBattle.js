//BASE
const BaseBattle = require("../../Base/Battle");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");
const { stripIndents } = require("common-tags");

//DATA
const characters = require("../../data/characters");
const emojis = require("../../data/emojis");
const enemies = require("../../data/enemies");
const talents = require("../../data/talents");

//UTILS
const enumHelper = require("../enumHelper");

class PVEBattle extends aggregation(BaseBattle, BaseHelper) {
  constructor(params) {
    super(params);
    const { totalEnemies, quest } = params;
    this.quest = quest;
    this.totalEnemies = totalEnemies;
    this.wave = 0;

    this.header = stripIndents(`
    ${this.msg.author}
    **TEAM POWER**: ${this.team.map((t) => t.name).join(", ")}
    **ENEMY POWER**: ${this.totalEnemies
      .map((wave) => wave.map((e) => e.name).join(", "))
      .join(", ")}
    `);
    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.team)
      return this.msg.reply("You don't have a team selected to battle with.");
    this.msgSent = await this.msg.say(this.header);
    const res = await this.Discord.confirmation({
      msg: this.msgSent,
      author: { id: this.player.discordId },
    });
    if (!res) return;
    enumHelper.isInBattle.add(this.player.discordId);

    for (this.wave; this.wave < this.totalEnemies.length; this.wave++) {
      await this.startWave();
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
      this.enemies.some((e) => e.HP > 0) &&
      enumHelper.isInBattle.has(this.player.discordId)
    );
    console.log("======wave ended=====");
    this.body = ""
  }

  async startRound() {
    const Battle = this;
    this.round++
    this.body += `*Round ${this.round}*\n`
    do {
      const res = await this.Discord.awaitResponse({
        type: "message",
        filter: function (response) {
          if (!response) return;
          const args = response.content.split(" ");
          return (
            args.length == 3 &&
            Battle.team[args[0] - 1].turnEnded == false &&
            Object.keys(Battle.team).includes((args[0] - 1).toString()) &&
            Object.keys(enumHelper.battleChoices).includes(args[1]) &&
            Object.keys(Battle.enemies).includes((args[2] - 1).toString()) &&
            response.author.id == Battle.player.discordId
          );
        },
        msg: this.msgSent,
        author: { id: this.player.discordId },
      });
      if (!res) return this.escape();
      const args = res.split(" ");
      //Player Turn
      this.castTalent(args[1], {
        caster: this.team[args[0] - 1],
        targeted:
          args[1] == "atk" ? this.enemies[args[2] - 1] : this.team[args[2] - 1],
        attackingTeam: this.team,
        defendingTeam: this.enemies,
      });
    } while (this.team.some((t) => t.turnEnded == false));
    console.log("//////ENEMY TURN//////");
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
    this.enemies.map(decreaseEffectTurn);
    this.updateBattleMsg();
    console.log("----round ended----");
  }

  escape() {
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  async endBattle() {
    const drops = enemies[this.enemy.id].drops;
    this.Game.addRewards(this.player, drops);
    let dropsMsg = "";
    for (const dropName in drops) {
      dropsMsg += `+ **${drops[dropName]}** ${dropName} ${this.Discord.emoji(
        dropName
      )}\n`;
    }
    this.body +=
      "\n" +
      stripIndents(`
    **__RESULT__**
    **${this.targeted.name}** was defeated! 💀
    👑 **${this.caster.name}** won the fight!

    **__DROPS__**
    ${dropsMsg}
    `);
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.edit(`${this.header}\n${this.body}`);
    /*
    this.msgSent.reactions.removeAll().catch(console.error);
    const res = await this.Discord.awaitResponse({
      type: "reaction",
      author: {id: this.player.discordId},
      msg: this.msgSent,
      chooseFrom: ["➡", "red cross"],
      deleteOnResponse: true,
    });*/
    await this.Game.addQuestProgress(this.player, "Defeat", this.enemy.id, 1);
  }

  castTalent(battleChoiceId, params) {
    console.log("talent casted");
    const battleChoice = enumHelper.battleChoices[battleChoiceId];
    const { caster, targeted } = params;
    const { attackingTeam, defendingTeam } = caster.talents[battleChoice].cast(
      params
    );
    this.team = enumHelper.isEnemy(caster.id) ? defendingTeam : attackingTeam;
    this.enemies = enumHelper.isEnemy(caster.id) ? attackingTeam : defendingTeam;

    //prettier-ignore
    if (this.header.length + (this.body.length || 0) > this.maxLength) this.body = "";
    //prettier-ignore
    this.body += `${enumHelper.isEnemy(caster.id) ? "🟥" : "🟦"} ${caster.name} uses **${caster.talents[battleChoice].name}** ${enumHelper.talentTypes[battleChoice].emoji} on ${targeted.name}.\n`;
    caster.turnEnded = true;
    this.updateBattleMsg();
  }

  updateBattleMsg() {
    this.header = stripIndents(`
    ${this.msg.author}
    **Your Team**
    ${this.team.map(formatBattleStats).join("\n")}

    **[Wave ${this.wave + 1}/${this.totalEnemies.length}] Enemies**
    ${this.enemies.map(formatBattleStats).join("\n")}

    __Battle Log__
    `);
    this.msgSent
      .edit(`${this.header}\n${this.body}`)
      .then(() => sleep(1500));
    console.log("updated Battle Msg");
  }
}

module.exports = PVEBattle;

function formatBattleStats(obj, i) {
  //prettier-ignore
  return `${i + 1}) ${obj.turnEnded ? "☑ " : ""}${obj.name} (${obj.HP}/${obj.MaxHP} HP)${obj.target.position !== null ? ` | Target: ${obj.target.position + 1}` : ""}${obj.effects.length !== 0 ? ` | Effects: ${Object.keys(obj.effects).map((eff)=> `${eff} (${obj.effects[eff]} Turns)`).join(", ")}` : ""}`;
}

function sleep(milliseconds) {
  console.log("started sleep");
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
  console.log("ended sleep");
}

function decreaseEffectTurn(obj) {
  obj.turnEnded = false;
  Object.keys(obj.effects).map((eff) => {
    obj.effects[eff] -= 1;
    if (obj.effects[eff] <= 0) delete obj.effects[eff];
  });
}
