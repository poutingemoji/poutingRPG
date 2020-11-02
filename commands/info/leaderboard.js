//BASE
const Command = require("../../Base/Command");

//DATA

module.exports = class TopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "top",
      aliases: ["leaderboard"],
      group: "info",
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
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg, { type }) {
    this.Game.Database.loadLeaderboard(type).then(async (leaderboard) => {
      const formatFilter = async (player) => {
        let attributes = [];
        try {
          const user = await this.client.users.fetch(player.discordId);
          switch (type) {
            case "level":
              attributes.push(`AR: ${player.level.current}`);
              break;
          }
          return `${user.tag} ${this.Discord.emoji(
            player.faction
          )} | ${attributes.join(" - ")}`;
        } catch (err) {
          console.error(err);
        }
      };

      this.Discord.Pagination.buildEmbeds(
        {
          title: "Leaderboard",
          msg,
        },
        formatFilter,
        leaderboard
      );
    });
  }
};
