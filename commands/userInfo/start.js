//BASE
const Command = require("../../Base/Command");

//DATA
const factions = require("../../poutingRPG/data/factions");
const positions = require("../../poutingRPG/data/positions");

module.exports = class StartCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "start",
      group: "user_info",
      memberName: "start",
      description: "Start your adventure.",
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author);
    if (player) {
      const res = await this.Discord.confirmation({
        msg,
        response: "Are you sure you want to start over?",
      });
      if (!res) return;
    }

    const Discord = this.Discord;
    const getDescriptions = [getPositionsDescription, getFactionsDescription];
    const traits = [positions, factions];
    const traitsChosen = [];

    for (let i = 0; i < getDescriptions.length; i++) {
      traitsChosen.push(
        this.snakeToCamelCase(
          await msg.reply(getDescriptions[i](Discord)).then((msgSent) => {
            return this.Discord.awaitResponse({
              type: "reaction",
              author: msg.author,
              msg: msgSent,
              chooseFrom: Object.keys(traits[i]).map((t) => traits[i][t].emoji),
              deleteOnResponse: true,
            });
          })
        )
      );
      console.log("Trait: ", traitsChosen[i]);
      if (!traitsChosen[i]) return;
    }
    this.Game.Database.createNewPlayer(msg.author.id, {
      factionId: traitsChosen[1],
      positionId: traitsChosen[0],
    });
    msg.say(generateStartedMsg(Discord, msg, traitsChosen));
  }
};

function generateStartedMsg(Discord, msg, traitsChosen) {
  const position = positions[traitsChosen[0]];
  const faction = factions[traitsChosen[1]];
  const msgs = {
    ["zahardEmpire"]: `I'll give you the privilege of joining my empire. I needed a ${position.name} anyways.`,
    ["FUG"]: `We're not nice people, I hope you can handle the difficult training in FUG. You are lucky we needed a ${position.name}...`,
    ["wolhaiksong"]: `Glad you made the right choice baby, we could really use another ${position.name}. Welcome to Wolhaiksong!`,
  };
  //prettier-ignore
  return `${Discord.emoji(faction.leader.emoji)} **${faction.leader.name}**: ${msg.author}, ${msgs[traitsChosen[1]]}`;
}

function getFactionsDescription(Discord) {
  let description = "Choose between the factions below:\n";
  for (const factionId of Object.keys(factions)) {
    const faction = factions[factionId];
    description += `${Discord.emoji(faction.emoji)} - **${faction.name}**\n${
      faction.description
    }\n`;
  }
  return description;
}

function getPositionsDescription(Discord) {
  let description = "Choose between the positions below:\n";
  for (const positionId of Object.keys(positions)) {
    const position = positions[positionId];
    description += `${Discord.emoji(position.emoji)} - **${position.name}**\n`;
  }
  return description;
}
