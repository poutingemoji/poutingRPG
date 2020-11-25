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
const { isEnemy, battleChoices, talentTypes } = require("../enumHelper");

class PVEBattle extends aggregation(BaseBattle, BaseHelper) {
  constructor(params) {
    console.log(params);
    super(params);
    const { totalEnemies, quest } = params;
    this.quest = quest;
    this.totalEnemies = totalEnemies;
    this.wave = 0;

    this.header = stripIndents(`
    ${this.msg.author}
    **TEAM POWER**: ${this.team.map((t) => t.name).join(", ")}
    **ENEMIES POWER**: 3200
    `);
    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.team)
      return this.msg.reply("You don't have a team selected to battle with.");
    this.msgSent = await this.msg.say(this.header);
    const res = await this.Discord.confirmation({
      msg: this.msgSent,
      author: this.player.discordId,
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
    do {
      this.updateBattleMsg();
      await this.startTurn();
    } while (
      this.enemies.some((e) => e.HP > 0) &&
      enumHelper.isInBattle.has(this.player.discordId)
    );
  }

  async startTurn() {
    //if (!enumHelper.isInBattle.has(this.player.discordId)) return;
    const Battle = this;
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
            Object.keys(battleChoices).includes(args[1]) &&
            Object.keys(Battle.enemies).includes((args[2] - 1).toString()) &&
            response.author.id == Battle.player.discordId
          );
        },
        msg: this.msgSent,
      });
      if (!res) return enumHelper.isInBattle.delete(this.player.discordId);
      const args = res.split(" ");
      //Player Turn
      this.castTalent(args[1], {
        caster: this.team[args[0] - 1],
        target:
          args[1] == "atk" ? this.enemies[args[2] - 1] : this.team[args[2] - 1],
        attackingTeam: this.team,
        defendingTeam: this.enemies,
      });
    } while (this.team.some((t) => t.turnEnded == false));

    //Enemy Turn
    /*
    this.enemies.map((e) => {
      this.castTalent(
        Object.keys(battleChoices)[
          Math.floor(Math.random() * Object.keys(battleChoices).length)
        ],
        {
          caster: e,
          target:
            this.team[e.target.position] ||
            this.team[Math.floor(Math.random() * this.team.length)],
          attackingTeam: this.enemies,
          defendingTeam: this.team,
        }
      );
      console.log(e);
    });*/
    this.team.map((t) => (t.turnEnded = false));
    this.enemies.map((e) => (e.turnEnded = false));
    this.updateBattleMsg();
  }

  escape() {
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  async endBattle() {
    const drops = enemies[this.enemy.name].drops;
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
    **${this.target.name}** was defeated! 💀
    👑 **${this.attacker.name}** won the fight!

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
    await this.Game.Database.addQuestProgress(
      this.player,
      "Defeat",
      this.enemy.name,
      1
    );
  }

  castTalent(battleChoice, params) {
    battleChoice = battleChoices[battleChoice];
    const { caster, target } = params;
    const talentType = talentTypes[battleChoice];
    const talentName = enumHelper.isEnemy(caster.name)
      ? enemies[caster.name].talent[battleChoice]
      : characters[caster.name].talent[battleChoice];

    const { attackingTeam, defendingTeam } = talents[talentName].cast(params);
    if (attackingTeam.every((te) => isEnemy(te))) {
      this.team = defendingTeam;
      this.enemies = attackingTeam;
    } else {
      this.team = attackingTeam;
      this.enemies = defendingTeam;
    }
    if (this.header.length + (this.body.length || 0) > this.maxLength)
      this.body = "";
    this.body += `${caster.name} uses **${talentName}** ${talentType.emoji} on ${target.name}.\n`;
    this.updateBattleMsg();
    caster.turnEnded = true;
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
    this.msgSent.edit(`${this.header}\n${this.body}`);
  }
}

module.exports = PVEBattle;

function formatBattleStats(obj, i) {
  //prettier-ignore
  return `${i + 1}) ${obj.turnEnded ? "☑ " : ""}${obj.name} (${obj.HP}/${obj.HP_MAX} HP)${obj.target.position !== null ? ` | Target: ${obj.target.position + 1}` : ""}${obj.effects.length !== 0 ? ` | Effects: ${Object.keys(obj.effects).join(", ")}` : ""}`;
}
