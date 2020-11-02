//BASE
const Command = require("../../Base/Command");
const moment = require("moment");

//DATA

module.exports = class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      group: "info",
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
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await this.Game.Database.findPlayer(user, msg);
    if (!player) return;

    const data = {
      ["Adventure Rank"]: player.level.current,
      [`*[${player.exp.current}/${player.exp.total} EXP]*`]: "",
      [`${this.Discord.emoji("points")} Points`]: player.points,
      [`${this.Discord.emoji("dallars")} Dallars`]: player.dallars,
      [`${this.Discord.emoji("suspendium")} Suspendium`]: player.suspendium,
    };

    const messageEmbed = this.Discord.buildEmbed({
      thumbnail: user.displayAvatarURL(),
      title: `Profile ${this.Discord.emoji(player.faction)}`,
      author: user,
      description: this.objectToString(data),
      footer: `Born: ${moment(player._id.getTimestamp()).format(
        "dddd, MMMM Do YYYY, h:mm:ss A"
      )}`,
    });
    msg.say(messageEmbed);
  }
};
