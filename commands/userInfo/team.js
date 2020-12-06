//BASE
const { stripIndents } = require("common-tags");
const Command = require("../../Base/Command");
const positions = require("../../data/positions")

//UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class TeamCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "team",
      group: "user_info",
      memberName: "team",
      description: "Manage your team.",
      examples: [
        `${client.commandPrefix}team`,
        `${client.commandPrefix}team select [teamNumber]`,
        `${client.commandPrefix}team add/remove [id]`,
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
          key: "id",
          prompt: "What's the id of the character/team?",
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

  async run(msg, { action, id }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    for (let i = 0; i < enumHelper.maxTeams; i++)
      if (!player.teams[i]) player.teams[i] = [];

    if (!id) {
      const formatFilter = (team, i) => {
        return stripIndents(
          `**Team ${i + 1} ${player.teamId == i ? "(Selected)" : ""}**
          ${team.length == 0 ? "" : Object.keys(positions)
            .map((positionId) => {
              //prettier-ignore
              const character = this.Game.getCharacter(player, team[positionId])
              return `${this.Discord.emoji(positionId)} ${character ?
                character.name : "None"
              }`;
            })
            .join("\n")}`
      )};
      this.Discord.Pagination.buildEmbeds(
        {
          msg,
          author: msg.author,
          title: "Teams",
        },
        formatFilter,
        player.teams
      );
    } else if (action == "select"){
      this.Game.changeSelectedTeam(player, id);
    } else {
      this.Game.changeTeamMembers(player, action, id);
    }
  }
};
