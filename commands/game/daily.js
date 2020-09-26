require("dotenv").config();
const { Command } = require("discord.js-commando");

const { findPlayer } = require("../../database/Database");
const { addExp, incrementValue } = require("../../database/functions");

const { randomIntFromInterval } = require("../../utils/helpers/intHelper");

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
    const player = await findPlayer(msg.author, msg);
    player.addExp = addExp;
    player.incrementValue = incrementValue;
    const exp = randomIntFromInterval(250, 400);
    const points = randomIntFromInterval(375, 600);
    await player.addExp(exp, msg);
    await player.incrementValue(msg.author, "points", points);
    msg.say(
      `${msg.author.username}, you've received your daily **${exp}** ✨ exp & your daily **${points}** ⛳ points.`
    );
  }
};
