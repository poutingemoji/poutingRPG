//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class ConfigCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "config",
      group: "game",
      memberName: "config",
      description: "View your config.",
      examples: [`${client.commandPrefix} config`],
      args: [
        {
          key: "setting",
          prompt: `What setting do you want to configure?`,
          type: "string",
          oneOf: ["spawns"],
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
      userPermissions: ["ADMINISTRATOR"],
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg, { setting }) {
    const channel = msg.channel;
    let response;
    switch (setting) {
      case "spawns":
        response = await this.Game.Database.setSpawnsEnabled(channel);
        break;
    }
    msg.say(response);
  }
};
