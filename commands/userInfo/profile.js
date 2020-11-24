//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");
const moment = require("moment");

//DATA

module.exports = class ProfileCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "profile",
      group: "user_info",
      memberName: "profile",
      description: "View someone's profile.",
      examples: [`${client.commandPrefix}profile [@user/id]`],
      args: [
        {
          key: "user",
          prompt: `Who's profile would you like to see?`,
          type: "user",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await this.Game.Database.findPlayer(user, msg);
    if (!player) return;

    const messageEmbed = this.Discord.buildEmbed({
      thumbnail: user.displayAvatarURL(),
      title: `Profile ${this.Discord.emoji(player.factionId)}`,
      author: user,
      description: stripIndents(`
        **Adventure Rank**: ${player.adventureRank.current}
        *[${player.exp.current}/${player.exp.total} EXP]*
        ${this.Discord.emoji("point")} **Points**: ${player.points}
        ${this.Discord.emoji("poutingem")} **Poutingems**: ${player.poutingems}
      `),
      footer: `Born: ${moment(player._id.getTimestamp()).format(
        "dddd, MMMM Do YYYY, h:mm:ss A"
      )}`,
    });
    msg.say(messageEmbed);
  }
};
