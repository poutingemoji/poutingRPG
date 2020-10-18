//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
require("dotenv").config();

module.exports = class TopCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "top",
      aliases: ["leaderboard"],
      group: "game",
      memberName: "top",
      description: "View the top players.",
      examples: [
        `${client.commandPrefix}top`,
        `${client.commandPrefix}top points`,
        `${client.commandPrefix}top dallars`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "type",
          prompt: "What would you like to sort the leaderboard by?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg, { type }) {
    await Game.leaderboard(msg);
  }
};
