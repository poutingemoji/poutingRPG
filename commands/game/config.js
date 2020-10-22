//BASE
const { Command } = require("discord.js-commando");

//DATA

// UTILS
const { Game, Discord } = require("../../DiscordBot");
const Helper = require("../../utils/Helper");

module.exports = class ConfigCommand extends Command {
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
    this.Discord = Discord;
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
