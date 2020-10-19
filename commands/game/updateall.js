//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA

module.exports = class UpdateAllCommand extends aggregation(
  Command,
  BaseHelper
) {
  constructor(client) {
    super(client, {
      name: "updateall",
      group: "game",
      memberName: "updateall",
      description: "Update all MongoDB documents.",
      throttling: {
        usages: 1,
        duration: 2000000000,
      },
      guildOnly: true,
      hidden: true,
      ownerOnly: true,
    });
  }

  run(msg) {
    updateAllPlayers();
    return msg.say("Updated all MongoDB documents, master.");
  }
};
