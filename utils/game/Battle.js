//BASE
const BaseHelper = require("../../Base/Helper");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");
const characters = require("../../pouting-rpg/data/characters");
const emojis = require("../../pouting-rpg/data/emojis");
const enemies = require("../../pouting-rpg/data/enemies");
const floors = require("../../pouting-rpg/data/floors");

//UTILS
const enumHelper = require("../enumHelper");
const battleChoices = enumHelper.battleChoices;

class Battle extends BaseHelper {
  constructor(params) {
    super();
    const { player, quest, msg, Discord, Game } = params;
    this.player = player;
    this.quest = quest;
    this.msg = msg;
    this.Discord = Discord;
    this.Game = Game;

    this.chapter = arcs[player.story.arc].chapters[player.story.chapter];
    this.floor = this.chapter.floor;

    this.totalEnemies = [];
    for (let wave of floors[this.player.floor.current - 1][this.chapter.area]) {
      let enemiesInWave = [];
      for (let enemyName in wave)
        this.fillArray(
          this.getBattleStats(enemyName),
          wave[enemyName],
          enemiesInWave
        );
      this.totalEnemies.push(enemiesInWave);
    }
    this.wave = 0;

    this.team = this.player.teams[this.player.selectedTeam].map((t) =>
      this.getBattleStats(t)
    );
    this.enemies = this.totalEnemies[this.wave];
    this.rewards = {};

    this.header = stripIndents(`
    ${msg.author}
    **TEAM POWER**: ${this.team.map((t) => t.name).join(", ")}
    **ENEMIES POWER**: ${this.enemies.map((e) => e.name).join(", ")}
    `);
    this.body = "";
    this.maxLength = 400;

    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.team)
      return this.msg.reply("You don't have a team selected to battle with.");
    enumHelper.isInBattle.add(this.player.discordId);
    this.msgSent = await this.msg.say(this.header);

    const res = await this.Discord.confirmation({
      msg: this.msgSent,
      author: this.player.discordId,
    });
    this.header = stripIndents(`
    **Team**
    ${this.team.map((t) => `${t.name} (${t.HP}/${t.HP_MAX} HP)`).join("\n")}

    **[Wave ${this.wave + 1}/${this.totalEnemies.length}] Enemies**
    ${this.enemies.map((e) => `${e.name} (${e.HP}/${e.HP_MAX} HP)`).join("\n")}
    `);

    this.msgSent.edit(this.header);

    for (this.wave; this.wave < this.totalEnemies.length; this.wave++) {
      await this.startWave();
    }
  }

  async startWave() {
    if (this.header.length + (this.body.length || 0) > this.maxLength) {
      this.body = "";
    }

    this.body += "\n__Battle Log__\n";
    this.team.map((t) => (t.turnEnded = false));
    this.enemies.map((e) => (e.turnEnded = false));
    const turns = [this.startPlayerTurn, this.startEnemyTurn];
    turns.map(async (turn) => {
      if (!enumHelper.isInBattle.has(this.player.discordId)) return;
      turn = turn.bind(this);
      await turn();
    });
    this.msgSent.edit(`${this.header}\n${this.body}`);
    /*

    while (!this.attacker.turnEnded || !this.target.turnEnded) {
      //prettier-ignore
      this.header = stripIndents(`
      ${this.msg.author}
      Fight ${this.quest.progress}/${this.quest.goal}
      **ALLY** ${this.ally.name}: 
      ${this.Discord.healthBar(this.ally.HP.current,this.ally.HP.total)}
      **ENEMY** ${this.enemy.name}: 
      ${this.Discord.healthBar(this.enemy.HP.current,this.enemy.HP.total)}
      `);
      if (this.target.HP.current <= 0) {
        this.endBattle();
      }
      this.attacker.turnEnded = true;
    }
    */
  }

  async startPlayerTurn() {
    console.log(this.Discord);
    const Battle = this;
    const res = await this.Discord.awaitResponse({
      type: "message",
      filter: function (response) {
        const args = response.content.split(" ");
        return (
          Object.keys(Battle.team).includes((args[0] - 1).toString()) &&
          battleChoices.includes(args[1]) &&
          Object.keys(Battle.enemies).includes((args[2] - 1).toString()) &&
          response.author.id == Battle.player.discordId
        );
      },
      msg: this.msgSent,
    });
    console.log(res);
  }

  async startEnemyTurn() {}

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
      author: this.player.discordId,
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

  hasCrit() {
    return Math.random() <= 0.25;
  }

  hasDodged() {
    return Math.random() < this.target.SPEED / 100;
  }

  // BATTLE FUNCS
  getBattleStats(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];
    return {
      name: name,
      HP: this.calculateHealth(data),
      HP_MAX: this.calculateHealth(data),
      ATK: this.calculateAttack(data),
    };
  }

  calculateHealth(data) {
    //this.player.level
    return data.baseStats.HP;
  }

  calculateAttack(data) {
    return data.baseStats.ATK;
  }

  isEnemy(name) {
    return enemies.hasOwnProperty(name);
  }
}

module.exports = Battle;
