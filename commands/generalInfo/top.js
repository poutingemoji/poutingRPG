//BASE
const Command = require("../../Base/Command");

//DATA
const factions = require("../../data/factions");
const enumHelper = require("../../utils/enumHelper");
module.exports = class LeaderboardCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      aliases: ["top"],
      group: "general_info",
      memberName: "leaderboard",
      description: "View the top players.",
      args: [
        {
          key: "type",
          prompt: "What would you like to sort the leaderboard by?",
          type: "string",
          oneOf: Object.keys(enumHelper.leaderboardFilters),
          default: "adventureRank",
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg, { type }) {
    const formatFilter = async (player) => {
      const user = await this.client.users.fetch(player.discordId);
      let userMsg = `${user} ${this.Discord.emoji(
        factions[player.factionId].emoji
      )} `;
      switch (type) {
        case "adventureRank":
          userMsg += `| AR: ${player.adventureRank.current}`;
          break;
      }
      return userMsg;
    };

    const leaderboard = await this.Game.Database.loadLeaderboard(type);
    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        title: "Leaderboard",
      },
      formatFilter,
      leaderboard
    );
  }
};
