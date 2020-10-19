//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA
const factions = require("../../pouting-rpg/data/factions");
const positions = require("../../pouting-rpg/data/positions");

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class StartCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "start",
      group: "game",
      memberName: "start",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
      guildOnly: true,
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (player) {
      const res = await this.Discord.confirmation(
        msg,
        "Are you sure you want to start over?"
      );
      if (!res) return;
    }
    const Discord = this.Discord;
    const getDescriptions = [getPositionsDescription, getFactionsDescription];
    const traits = [positions, factions];
    const traitsChosen = [];

    for (let i = 0; i < getDescriptions.length; i++) {
      traitsChosen.push(
        await msg
          .reply(getDescriptions[i](Discord, traitsChosen[0]))
          .then((msgSent) => {
            return this.Discord.awaitResponse({
              type: "reaction",
              author: msg.author.id,
              msg: msgSent,
              chooseFrom: traits[i],
            });
          })
      );
      if (!traitsChosen[i]) return;
    }
    msg.say(generateStartedMsg(Discord, msg, traitsChosen));
  }
};

function generateStartedMsg(Discord, msg, traitsChosen) {
  const positionName = traitsChosen[0];
  const factionName = traitsChosen[1];
  const leader = factions[factionName].leader;
  const msgs = {
    Zahard:
      "I'll give you the privilege of joining my empire, the correct choice was pretty obvious wasn't it?",
    FUG:
      "We're not nice people, I hope you can handle the difficult training in FUG.",
    Wolhaiksong: "Glad you made the right choice baby, welcome to Wolhaiksong!",
  };

  return `${Discord.emoji(leader)} **${leader}**: ${msg.author}, ${
    msgs[factionName]
  }`;
}

function getFactionsDescription(Discord, positionName) {
  let description = `You are a ${Discord.emoji(
    positionName
  )} ${positionName}. \nChoose between the factions below:\n`;
  for (const factionName of Object.keys(factions)) {
    const faction = factions[factionName];
    description += `${Discord.emoji(
      factionName
    )} - **${factionName}**\n${factionName} favours ${faction.favouredPositions.join(
      " and "
    )}.\n`;
  }
  return description;
}

function getPositionsDescription(Discord) {
  let description = "Choose between the positions below:\n";
  for (const positionName of Object.keys(positions)) {
    const position = positions[positionName];
    const advantageOver = position.advantageOver;
    const keys = Object.keys(advantageOver);
    console.log(advantageOver);
    description += `${Discord.emoji(
      positionName
    )} - **${positionName}**\n${positionName} has a ${
      advantageOver[keys[0]] * 100
    }% advantage over ${keys.length == 1 ? keys[0] : "all other positions"}.\n`;
  }
  return description;
}
