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
        `${client.commandPrefix}teams add/remove [teamNumber] [characterName]`,
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
          key: "characterName",
          prompt: "What's the name of the character you want to add/remove?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg, { teamNumber, action, characterName }) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    for (let i = 0; i < enumHelper.maxTeams; i++)
      if (!player.teams[i]) player.teams[i] = [];

    if (!teamNumber) {
      const formatFilter = (team, i) => {
        return `**Team ${i + 1} ${
          player.selectedTeam == i ? "(Selected)" : ""
        }**${team.length == 0 ? "" : "\n"}${team
          .map((characterName) => `• ${characterName}`)
          .join("\n")}`;
      };

      this.Discord.Pagination.buildEmbeds(
        {
          title: "Teams",
          author: msg.author,
          msg,
        },
        formatFilter,
        player.teams
      );
    } else {
      this.Game.Database.manageTeam(player, action, teamNumber, characterName);
    }
  }
};
