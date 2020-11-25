//BASE
const Command = require("../../Base/Command");

//DATA
const factions = require("../../data/factions");
const positions = require("../../data/positions");

//prettier-ignore
module.exports = class StartCommand extends Command {
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

    let description = "Choose between the factions below:\n";
    for (const factionId of Object.keys(factions)) {
      const faction = factions[factionId];
      description += `${this.Discord.emoji(faction.emoji)} - **${faction.name}**\n${faction.description}\n\n`;
    }

    const factionId = this.snakeToCamelCase(
      await msg.say(`${msg.author}\n${description}`).then((msgSent) => {
        return this.Discord.awaitResponse({
          type: "reaction",
          author: msg.author,
          msg: msgSent,
          chooseFrom: Object.keys(factions).map((f) => factions[f].emoji),
          deleteOnResponse: true,
        });
      }))
    if (!factionId) return;
    this.Game.Database.createNewPlayer(msg.author.id, {
      factionId,
    });

    const msgs = {
      ["zahardEmpire"]: `I'll give you the privilege of joining my empire.`,
      ["FUG"]: `We're not nice people, I hope you can handle the difficult training in FUG.`,
      ["wolhaiksong"]: `Glad you made the right choice baby, welcome to Wolhaiksong!`,
    };
    //prettier-ignore
    const faction = factions[factionId];
    return msg.say(`${this.Discord.emoji(faction.leader.emoji)} **${faction.leader.name}**: ${msg.author}, ${msgs[factionId]}`);
  }
};
