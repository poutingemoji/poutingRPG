require("dotenv").config();
const { Command } = require("discord.js-commando");

const { emoji } = require("../../utils/helpers/msgHelper");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      aliases: [],
      group: "moderation",
      memberName: "ban",
      description: "Bans the specified user.",
      examples: [`${client.commandPrefix}ban [user]`],
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "Who would you like to ban?",
          type: "user",
        },
        {
          key: "intOfDays",
          prompt: "How many days would you like this user to be banned?",
          type: "integer",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }
  run(msg, { user, intOfDays }) {
    msg.guild
      .member(user)
      .ban({ days: intOfDays })
      .then(() => {
        msg.say(
          `Successfully banned **${user.tag}**${
            intOfDays ? ` for ${intOfDays} day(s)` : ""
          }.`
        );
      })
      .catch(() => {
        msg.say(`${emoji(msg, "err")} Unable to ban **${user.tag}**.`);
      });
  }
};
