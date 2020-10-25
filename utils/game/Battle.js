//BASE
const { stripIndents } = require("common-tags");

//DATA
const {} = require("../../DiscordBot");
const characters = require("../../pouting-rpg/data/characters");
const emojis = require("../../pouting-rpg/data/emojis");
const enemies = require("../../pouting-rpg/data/enemies");

//UTILS
const enumHelper = require("../enumHelper");
const Helper = require("../Helper");

const choices = {
  ["⚔️"]: "attack",
  ["🛡️"]: "defend",
  ["red cross"]: "escape",
};

class Battle {
  constructor(params) {
    console.log("yeah");
    const { player, target, msg, Discord } = params;
    this.msg = msg;
    this.Discord = Discord;
    this.player = player;

    this.ally = this.player.selectedCharacter;
    this.enemy = target;

    this.round = 0;
    this.rewards = {};

    this.header = `${msg.author}\n ${this.ally} VS ${this.enemy}\n`;
    this.response = this.header;
    this.maxLength = 800;

    this.initiateBattle();
  }

  async initiateBattle() {
    if (!this.ally)
      return this.msg.reply(
        "You don't have a character selected to battle with."
      );
    enumHelper.isInBattle.add(this.player.discordId);
    this.ally = this.getBattleStats(this.ally);
    this.enemy = this.getBattleStats(this.enemy);
    if (this.enemy.SPEED == this.ally.SPEED) {
      const shuffled = [this.ally, this.enemy].sort(() => Math.random() - 0.5);
      this.attacker = shuffled[0];
      this.target = shuffled[1];
    } else {
      [this.attacker, this.target] = [this.ally, this.enemy].sort(
        (a) => a.SPEED
      );
    }

    this.msgSent = await this.msg.say(this.response);

    for (let choice of Object.keys(choices)) {
      choice = choice.replace(/ /g, "_");
      await this.msgSent.react(emojis[choice] || choice);
    }
      
    do {
      let res = await this.Discord.awaitResponse({
        type: "reaction",
        author: this.player.discordId,
        msg: this.msgSent,
        chooseFrom: Object.keys(choices),
        deleteOnResponse: false,
        reactToMessage: false,
        removeAuthorReaction: true,
      });
      console.log(res);
      await this.initiateRound(res);
    } while (enumHelper.isInBattle.has(this.player.discordId));
  }

  initiateRound(res) {
    if (this.response.length > this.maxLength) {
      this.response = this.header;
    }
    this.round++;
    this.response += `\n**[ROUND ${this.round}]**\n`;
    this.attacker.turnEnded = false;
    this.target.turnEnded = false;
    console.log(res);

    this.ally.choice = choices[res || "attack"];

    if (Math.random() >= 0.5) {
      this.enemy.choice = "attack";
    } else {
      this.enemy.choice = "defend";
    }

    while (!this.attacker.turnEnded || !this.target.turnEnded) {
      console.log(this.attacker.choice);
      this[this.attacker.choice]();
      if (!enumHelper.isInBattle.has(this.player.discordId)) return;

      this.response += ` \`[${this.target.HP}/${this.target.HP_MAX}]\` ❤\n`;
      if (this.target.HP <= 0) {
        this.endBattle();
      }
      this.attacker.turnEnded = true
      this.msgSent.edit(this.response);
      //prettier-ignore
      this.target = swap(this.attacker, (this.attacker = this.target));
      //console.log("Switched:", this.target, this.attacker);
    }
    this.target = swap(this.attacker, (this.attacker = this.target));
  }

  attack() {
    this.response += `${this.attacker.name} attacks ⚔️, `;
    if (this.target.choice == "defend" && this.target.turnEnded) {
      this.target.HP -= this.attacker.ATK - this.target.DEF;
      this.response += `but ${this.target.name} is defending 🛡️, he loses ${
        this.attacker.ATK - this.target.DEF
      } HP(s)!`;
    } else if (this.hasDodged()) {
      this.response += `but ${this.target.name} dodges 🍃!`;
    } else {
      this.target.HP -= this.attacker.ATK;
      this.response += `he loses ${this.attacker.ATK} HP(s).`;
    }
  }

  defend() {
    if (this.target.choice == "attack" && !this.target.turnEnded) {
      this.response += `${this.attacker.name} prepares to defend 🛡️ against ${this.target.name}!`;
    } else if (this.target.choice == "attack" && this.target.turnEnded) {
      this.response += `${this.attacker.name} was too late to defend?`;
    } else if (this.target.choice == "defend") {
      this.response += `${this.attacker.name} stares expressionlessly 😑 at ${this.target.name} defending as well...`;
    }
  }

  escape() {
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  endBattle() {
    this.response +=
      "\n" +
      stripIndents(`
    **__RESULT__**
    **${this.target.name}** was defeated! 💀
    👑 **${this.attacker.name}** won the fight!
    `);
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.edit(this.response);
  }

  hasDodged() {
    return Math.random() < this.target.SPEED / 100;
  }

  // BATTLE FUNCS
  getBattleStats(name) {
    console.log(name);
    return {
      name: name,
      HP_MAX: this.calculateHealth(name),
      HP: this.calculateHealth(name),
      ATK: this.calculateAttack(name),
      DEF: this.calculateDefense(name),
      SPEED: this.calculateSpeed(name),
    };
  }

  calculateHealth(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];

    return data.baseStats.HP;
  }

  calculateAttack(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];

    return data.baseStats.ATK;
  }

  calculateDefense(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];

    return data.baseStats.DEF;
  }

  calculateSpeed(name) {
    const data = this.isEnemy(name) ? enemies[name] : characters[name];

    return data.baseStats.SPEED;
  }

  isEnemy(name) {
    return enemies.hasOwnProperty(name);
  }
}

module.exports = Battle;

const times = (x) => (f) => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

const twice = times(2);

const swap = function (x) {
  return x;
};
