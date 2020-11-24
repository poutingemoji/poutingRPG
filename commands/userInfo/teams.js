//BASE
const Command = require("../../Base/Command");
const characters = require("../../poutingRPG/data/characters");

//UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class TeamsCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "teams",
      group: "user_info",
      memberName: "teams",
      description: "Manage your teams.",
      examples: [
        `${client.commandPrefix}teams`,
        `${client.commandPrefix}teams select [teamNumber]`,
        `${client.commandPrefix}teams add/remove [teamNumber] [characterId]`,
      ],
      args: [
        {
          key: "action",
          prompt: "What action would you like to perform on your teams?",
          type: "string",
          oneOf: ["select", "add", "remove"],
          default: false,
        },
        {
          key: "teamNumber",
          prompt: "Which team do you want to manage?",
          type: "string",
          default: false,
        },
        {
          key: "characterId",
          prompt: "What's the id of the character you want to add/remove?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { teamNumber, action, characterId }) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    for (let i = 0; i < enumHelper.maxTeams; i++)
      if (!player.teams[i]) player.teams[i] = [];

    if (!teamNumber) {
      const formatFilter = (team, i) => {
        return `**Team ${i + 1} ${
          player.selectedTeam == i ? "(Selected)" : ""
        }**${team.length == 0 ? "" : "\n"}${team
          .map((characterId) => `• ${characterId}`)
          .join("\n")}`;
      };

      this.Discord.Pagination.buildEmbeds(
        {
          msg,
          author: msg.author,
          title: "Teams",
        },
        formatFilter,
        player.teams
      );
    } else {
      this.Game.Database.manageTeam(player, action, teamNumber, characterId);
    }
  }
};
