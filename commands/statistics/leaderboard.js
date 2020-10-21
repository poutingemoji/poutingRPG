//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA

// UTILS
const { Game } = require("../../DiscordBot");

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
      args: [
        {
          key: "type",
          prompt: "What would you like to sort the leaderboard by?",
          type: "string",
          default: "level",
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg, { type }) {
    this.Game.Database.loadLeaderboard(type).then(async (leaderboard) => {
      const format = async (i) => {
        let attributes = [];
        const player = leaderboard[i];
        try {
          const user = await this.client.users.fetch(player.discordId);
          switch (type) {
            case "level":
              attributes.push(`AR: ${player.adventureRank.current}`);
              break;
          }
          return `${user.username} ${this.Discord.emoji(
            player.faction
          )} | ${attributes.join(" - ")}`;
        } catch (err) {
          console.log(err);
        }
      };

      this.Discord.Pagination.buildEmbeds(
        {
          title: "Leaderboard",
          msg,
        },
        format,
        leaderboard
      );
    });
  }
};
