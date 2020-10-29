//BASE
const { stripIndents } = require("common-tags");

//DATA
const characters = require("../../pouting-rpg/data/characters");
const emojis = require("../../pouting-rpg/data/emojis");
const enemies = require("../../pouting-rpg/data/enemies");

//UTILS
const enumHelper = require("../enumHelper");

const choices = {
  ["⚔️"]: "attack",
  ["🛡️"]: "defend",
  ["red cross"]: "escape",
};

class Battle {
  constructor(params) {
    const { player, target, msg, Discord, Game } = params;
    this.msg = msg;
    this.Discord = Discord;
    this.Game = Game;
    this.player = player;

    this.ally = this.player.selectedCharacter;
    this.enemy = target;

    this.round = 0;
    this.rewards = {};

    this.header = stripIndents(`
    ${msg.author}
    **ALLY** ${this.ally} VS. **ENEMY** ${this.enemy}
    `);
    this.body = "";
    this.maxLength = 400;

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

    this.msgSent = await this.msg.say(this.header);

    for (let choice of Object.keys(choices)) {
      choice = choice.replace(/ /g, "_");
      await this.msgSent.react(emojis[choice] || choice);
    }

    do {
      const res = await this.Discord.awaitResponse({
        type: "reaction",
        author: this.player.discordId,
        msg: this.msgSent,
        chooseFrom: Object.keys(choices),
        deleteOnResponse: false,
        reactToMessage: false,
        removeAuthorReaction: true,
      });
      this.initiateRound(res);
    } while (enumHelper.isInBattle.has(this.player.discordId));
  }

  initiateRound(res) {
    if(res === undefined) res = "attack"
    console.log(!res, res)
    if (this.header.length + (this.body.length || 0) > this.maxLength) {
      this.body = "";
    }
    this.round++;
    this.body += `\n**[ROUND ${this.round}]**\n`;
    this.attacker.turnEnded = false;
    this.target.turnEnded = false;

    this.ally.choice = choices[res];
    if (!res) this.ally.choice = choices["attack"];
    if (Math.random() >= 0.5) {
      this.enemy.choice = "attack";
    } else {
      this.enemy.choice = "defend";
    }
    console.log(this.attacker.choice, this.target.choice);

    while (!this.attacker.turnEnded || !this.target.turnEnded) {
      console.log(this.attacker.choice);
      this[this.attacker.choice]();
      if (!enumHelper.isInBattle.has(this.player.discordId)) return;
      //prettier-ignore
      this.header = stripIndents(`
      ${this.msg.author}
      **ALLY** ${this.ally.name}: 
      ${this.Discord.healthBar(this.ally.HP.current,this.ally.HP.total)}
      **ENEMY** ${this.enemy.name}: 
      ${this.Discord.healthBar(this.enemy.HP.current,this.enemy.HP.total)}
      `);
      this.body += "\n";
      if (this.target.HP.current <= 0) {
        this.endBattle();
      }
      this.attacker.turnEnded = true;
      this.msgSent.edit(`${this.header}\n${this.body}`);
      //prettier-ignore
      this.target = swap(this.attacker, (this.attacker = this.target));
      //console.log("Switched:", this.target, this.attacker);
    }
    this.target = swap(this.attacker, (this.attacker = this.target));
  }

  attack() {
    this.body += `${this.attacker.name} attacks ⚔️, `;
    if (this.target.choice == "defend" && this.target.turnEnded) {
      this.target.HP.current -= this.attacker.ATK - this.target.DEF;
      this.body += `but ${this.target.name} is defending 🛡️, he loses __${
        this.attacker.ATK - this.target.DEF
      }__ HP(s)!`;
    } else if (this.hasDodged()) {
      this.body += `but ${this.target.name} dodges 🍃!`;
    } else {
      this.target.HP.current -= this.attacker.ATK;
      this.body += `he loses __${this.attacker.ATK}__ HP(s).`;
    }
  }

  defend() {
    if (this.target.choice == "attack" && !this.target.turnEnded) {
      this.body += `${this.attacker.name} prepares to defend 🛡️ against ${this.target.name}!`;
    } else if (this.target.choice == "attack" && this.target.turnEnded) {
      this.body += `${this.attacker.name} was too late to defend?`;
    } else if (this.target.choice == "defend") {
      this.body += `${this.attacker.name} stares expressionlessly 😑 at ${this.target.name} defending as well...`;
    }
  }

  escape() {
    enumHelper.isInBattle.delete(this.player.discordId);
    this.msgSent.delete();
  }

  endBattle() {
    const drops = enemies[this.enemy.name].drops
    this.Game.addRewards(this.player, drops)
    let dropsMsg = ""
    for (const dropName in drops) {
      dropsMsg += `+ **${drops[dropName]}** ${dropName} ${this.Discord.emoji(dropName)}\n`
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
  }

  hasDodged() {
    return Math.random() < this.target.SPEED / 100;
  }

  // BATTLE FUNCS
  getBattleStats(name) {
    console.log(name, this.calculateHealth(name))
    return {
      name: name,
      HP: {
        current: this.player.characters.get(name)
          ? Math.floor(this.player.characters.get(name).HP.current)
          : this.calculateHealth(name),
        total: this.player.characters.get(name)
          ? this.player.characters.get(name).HP.total
          : this.calculateHealth(name),
      },
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

const swap = function (x) {
  return x;
};
