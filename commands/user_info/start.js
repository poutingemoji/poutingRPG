//BASE
const Command = require("../../Base/Command");
const { camelCase, snakeCase } = require("change-case")

//DATA
const factions = require("../../data/factions");
const { responseWaitTime } = require("../../utils/enumHelper");
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
    const player = await this.Game.findPlayer(msg.author);
    if (player) {
      const res = await this.Discord.confirmation({
        msg,
        response: "Are you sure you want to start over?",
      });
      if (!res) return;
    }

    let description = "__Choose between the factions below:__\n";
    for (const factionId of Object.keys(factions)) {
      const faction = factions[factionId];
      description += `${this.Discord.emoji(faction.emoji)} **${faction.name}**\n${faction.description}\n\n`;
    }

    const factionId = camelCase(
      await msg.say(`${msg.author}\n${description}`).then((msgSent) => {
        return this.Discord.awaitResponse({
          author: msg.author,
          msg: msgSent,
          type: "reaction",
          deleteOnResponse: true,
          chooseFrom: Object.keys(factions).map((f) => factions[f].emoji),
          responseWaitTime: responseWaitTime,
        });
      }))
    if (!factionId) return;
    
    this.Game.Database.createNewPlayer(msg.author.id, {
      factionId,
    });

    const msgs = {
      zahardEmpire: "I'll give you the privilege of joining my empire.",
      fug: "We're not nice people, I hope you can handle the difficult training in FUG.",
      wolhaiksong: "Glad you made the right choice baby, welcome to Wolhaiksong!",
    };
    const faction = factions[factionId];
    return msg.say(`${this.Discord.emoji(faction.leader.emoji)} **${faction.leader.name}**: ${msg.author}, ${msgs[factionId]}`);
  }
};
