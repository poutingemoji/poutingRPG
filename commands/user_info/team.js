//BASE
const { stripIndents } = require("common-tags");
const Command = require("../../Base/Command");

//UTILS
const { maxTeams, maxTeamMembers } = require("../../utils/enumHelper");
const { isBetween } = require("../../utils/Helper");

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
        `${client.commandPrefix}team select [teamId]`,
        `${client.commandPrefix}team add [characterId] (index)`,
        `${client.commandPrefix}team remove [characterId/index]`,
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

    if (Number.isInteger(id)) id--;
    if (Number.isInteger(index)) index--;
    const selectedTeam = player.teams[player.teamId] || [];
    switch (action) {
      case "select":
        if (!isBetween(id, 0, maxTeams)) return;
        player.teamId = id;
        this.Game.Database.savePlayer(player);
        break;
      case "add":
        if (!this.Game.getObjectStats(player, id)) return;
        if (index) {
          if (!isBetween(index, 0, maxTeamMembers)) return;
          selectedTeam[index] = id;
        } else {
          if (selectedTeam.length == maxTeamMembers) selectedTeam.shift();
          selectedTeam.push(id);
        }
        player.teams[player.teamId] = selectedTeam;
        this.Game.Database.savePlayer(player);
        break;
      case "remove":
        index = Number.isInteger(id) ? id : selectedTeam.indexOf(id);
        if (!isBetween(index, 0, maxTeamMembers)) return;
        selectedTeam.splice(index, 1);
        this.Game.Database.savePlayer(player);
        break;
      default:
        const messageEmbed = this.Discord.buildEmbed({
          msg,
          author: msg.author,
          title: "Teams",
        });

        for (let i = 0; i < maxTeams; i++) {
          if (!player.teams[i]) player.teams[i] = [];
          let teamMembers = [];
          for (let j = 0; j < maxTeamMembers; j++) {
            if (!player.teams[i][j]) {
              teamMembers[j] = "_";
            } else {
              const character = this.Game.getObjectStats(
                player,
                player.teams[i][j]
              );
              teamMembers[j] = `${this.Discord.emoji(
                character.constructor.name
              )} ${character.name}`;
            }
          }
          messageEmbed.addField(
            `**Team ${i + 1} ${player.teamId == i ? "📌" : ""}**`,
            `${teamMembers.join("\n")}`,
            true
          );
        }
        msg.say(messageEmbed);
    }
  }
};
