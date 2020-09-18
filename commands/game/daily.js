require("dotenv").config();
const { Command } = require("discord.js-commando");

const {
  findPlayer,
  addExpPlayer,
  changeValuePlayer,
} = require("../../database/Database");
const { randomIntFromInterval } = require("../../utils/Helper");

const arcs = require("../../docs/data/arcs");

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "daily",
      aliases: [],
      group: "game",
      memberName: "daily",
      description: "Claim your daily reward.",
      examples: [`${client.commandPrefix}daily`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 82800,
      },
    });
  }

  async run(msg) {
    const player = await findPlayer(msg, msg.author);
    const exp = randomIntFromInterval(250, 400);
    const points = randomIntFromInterval(375, 600);
    await addExpPlayer(msg.author, msg, exp);
    await changeValuePlayer(msg.author, "points", points);
    msg.say(
      `${msg.author.username}, you've received your daily **${exp}** ✨ exp & your daily **${points}** ⛳ points.`
    );
  }
};
