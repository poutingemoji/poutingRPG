//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
require("dotenv").config();

module.exports = class UpdateAllCommand extends aggregation(
  Command,
  BaseHelper
) {
  constructor(client) {
    super(client, {
      name: "updateall",
      aliases: [],
      group: "game",
      memberName: "updateall",
      description: "Update all MongoDB documents.",
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      hidden: true,
      ownerOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 2000000000,
      },
    });
  }

  run(msg) {
    updateAllPlayers();
    return msg.say("Updated all MongoDB documents, master.");
  }
};
