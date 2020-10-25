//BASE
const { Command } = require("discord.js-commando");

//DATA
const factions = require("../../pouting-rpg/data/factions");
const positions = require("../../pouting-rpg/data/positions");

// UTILS
const { Discord, Game } = require("../../DiscordBot");

module.exports = class StartCommand extends Command {
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
    this.Discord = Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author);
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
          .reply(getDescriptions[i](Discord, traitsChosen[i-1]))
          .then((msgSent) => {
            return this.Discord.awaitResponse({
              type: "reaction",
              author: msg.author.id,
              msg: msgSent,
              chooseFrom: traits[i],
            });
          })
      );
      console.log(traitsChosen[i])
      if (!traitsChosen[i]) return;
    }
    this.Game.Database.createNewPlayer(msg.author.id, {
      factionName: traitsChosen[1],
      positionName: traitsChosen[0],
    });
    msg.say(generateStartedMsg(Discord, msg, traitsChosen));
  }
};

function generateStartedMsg(Discord, msg, traitsChosen) {
  const positionName = traitsChosen[0];
  const factionName = traitsChosen[1];
  const leader = factions[factionName].leader;
  const msgs = {
    Zahard:
      `I'll give you the privilege of joining my empire, I needed a ${positionName} anyways.`,
    FUG:
      `We're not nice people, I hope you can handle the difficult training in FUG. You are lucky we wanted a ${positionName}...`,
    Wolhaiksong: `Glad you made the right choice baby, we could really use another ${positionName}. Welcome to Wolhaiksong!`,
  };

  return `${Discord.emoji(leader)} **${leader}**: ${msg.author}, ${
    msgs[factionName]
  }`;
}

function getFactionsDescription(Discord, positionName) {
  let description = `You are a **${positionName}** ${Discord.emoji(
    positionName
  )}. \nChoose between the factions below:\n`;
  for (const factionName of Object.keys(factions)) {
    const factionData = factions[factionName];
    description += `${Discord.emoji(
      factionName
    )} - **${factionName}**\n${factionName} favours ${factionData.favouredPositions.join(
      " and "
    )}.\n`;
  }
  return description;
}

function getPositionsDescription(Discord) {
  let description = "Choose between the positions below:\n";
  for (const positionName of Object.keys(positions)) {
    const positionData = positions[positionName];
    const advantageOver = positionData.advantageOver;
    const keys = Object.keys(advantageOver);
    console.log(advantageOver);
    console.log(positionName)
    description += `${Discord.emoji(
      positionName
    )} - **${positionName}**\n${positionName} has a ${
      advantageOver[keys[0]] * 100
    }% advantage over ${keys.length == 1 ? keys[0] : "all other positions"}.\n`;
  }
  return description;
}
