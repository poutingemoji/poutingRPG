//BASE
const { stripIndents } = require("common-tags");
const Command = require("../../Base/Command");
const positions = require("../../data/positions");

//UTILS
const { maxTeams } = require("../../utils/enumHelper");

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

    if (!id) {
      const messageEmbed = this.Discord.buildEmbed({
        msg,
        author: msg.author,
        title: "Teams",
      });

      for (let i = 0; i < maxTeams; i++) {
        messageEmbed.addField(
          `**Team ${i + 1} ${player.teamId == i ? "(Selected)" : ""}**`,
          stripIndents(
            `${
              player.teams[i]
                ? Object.keys(positions)
                    .map((positionId) => {
                      //prettier-ignore
                      const character = this.Game.getCharacter(player, player.teams[i][positionId])
                      return `${this.Discord.emoji(positionId)} ${
                        character ? character.name : ""
                      }`;
                    })
                    .join("\n")
                : ""
            }`
          ),
          true
        );
      }
      msg.say(messageEmbed);
    } else if (action == "select") {
      this.Game.changeSelectedTeam(player, id);
    } else {
      this.Game.changeTeamMembers(player, action, id);
    }
  }
};
