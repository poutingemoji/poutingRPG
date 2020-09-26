require("dotenv").config();
const { Command } = require("discord.js-commando");

module.exports = class OwnerCommand extends Command {
  constructor(client) {
    super(client, {
      name: "owner",
      aliases: [],
      group: "info",
      memberName: "owner",
      description: "Shows the owner of this bot.",
      examples: [`${client.commandPrefix}owner`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }
  run(msg) {
    msg.say(`${msg.author}, my owner is **poutingemoji#5785**.`);
  }
};
