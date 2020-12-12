//BASE
const { jpegVersion } = require("canvas");
const { stripIndents } = require("common-tags");
const Command = require("../../Base/Command");
const positions = require("../../data/positions");

//UTILS
const { maxTeams, maxTeamMembers } = require("../../utils/enumHelper");

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
          prompt: "What action would you like to perform?",
          type: "string",
          oneOf: ["select", "add", "remove"],
          default: false,
        },
        {
          key: "id",
          prompt: "What's the id of the team/character?",
          type: "string",
          default: false,
        },
        {
          key: "index",
          prompt: "What index do you want your team member in?",
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

  async run(msg, { action, id, index }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    if (!id) {
      const messageEmbed = this.Discord.buildEmbed({
        msg,
        author: msg.author,
        title: "Teams",
      });

      for (let i = 0; i < maxTeams; i++) {
        if (!player.teams[i]) player.teams[i] = []
        let teamMembers = []
        for (let j = 0; j < maxTeamMembers; j++) {
          if (!player.teams[i][j]) {
            teamMembers[j] = "_"
          } else {
            const character = this.Game.getCharacter(player, player.teams[i][j])
            teamMembers[j] = `${this.Discord.emoji(character.position.emoji)} ${character.name}`
          }
        }
        messageEmbed.addField(
          `**Team ${i + 1} ${player.teamId == i ? "(Selected)" : ""}**`,
            `${teamMembers.join("\n")}`,
          true
        );
      }
      msg.say(messageEmbed);
    } else {
      switch (action) {
        case "select":
          this.Game.changeSelectedTeam(player, id);
          break;
        case "add":
          this.Game.addTeamMember(player, id, index);
          break;
        case "remove":
          this.Game.removeTeamMember(player, id, index);
          break;
      }
    }
  }
};
