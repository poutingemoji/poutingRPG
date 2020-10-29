//BASE
const Command = require("../../Base/Command");

//DATA
const factions = require("../../pouting-rpg/data/factions");
const positions = require("../../pouting-rpg/data/positions");

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
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
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
          .reply(getDescriptions[i](Discord))
          .then((msgSent) => {
            console.log(traits[i])
            return this.Discord.awaitResponse({
              type: "reaction",
              author: msg.author.id,
              msg: msgSent,
              chooseFrom: traits[i],
            });
          })
      );
      console.log(traitsChosen[i]);
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
    ["Zahard Empire"]: `I'll give you the privilege of joining my empire. I needed a ${positionName} anyways.`,
    ["FUG"]: `We're not nice people, I hope you can handle the difficult training in FUG. You are lucky we needed a ${positionName}...`,
    ["Wolhaiksong"]: `Glad you made the right choice baby, we could really use another ${positionName}. Welcome to Wolhaiksong!`,
  };

  return `${Discord.emoji(leader)} **${leader}**: ${msg.author}, ${
    msgs[factionName]
  }`;
}

function getFactionsDescription(Discord) {
  let description = "Choose between the factions below:\n";
  for (const factionName of Object.keys(factions)) {
    const factionData = factions[factionName];
    description += `${Discord.emoji(
      factionName
    )} - **${factionName}**\n${factionData.description}\n`;
  }
  return description;
}

function getPositionsDescription(Discord) {
  let description = "Choose between the positions below:\n";
  for (const positionName of Object.keys(positions)) {
    const positionData = positions[positionName];
    description += `${Discord.emoji(
      positionName
    )} - **${positionName}**\n${positionName}'s nemesis is ${
      positionData.nemesis
    }.\n`;
  }
  return description;
}
