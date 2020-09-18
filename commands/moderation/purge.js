require("dotenv").config();
const { Command } = require("discord.js-commando");

const { emoji } = require("../../utils/Helper");

const minLimit = 1;
const maxLimit = 100;

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      aliases: ["prune", "clear", "wipe"],
      group: "moderation",
      memberName: "purge",
      description: "Allows you to mass delete messages in your server.",
      examples: [`${client.commandPrefix}purge [#msgs]`],
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
      args: [
        {
          key: "int",
          prompt: "How many messages would you like to purge?",
          type: "integer",
          validate: (int) => {
            if (isNaN(int)) return;
            if (!Number.isInteger(int)) return 'You need to provide an integer.';
            if (int < minLimit)
              return `You need to purge at least ${minLimit} msg(s).`;
            if (int > maxLimit)
              return `You can't purge more than ${maxLimit} msg(s)`;
            return true;
          },
        },
      ],
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }
  run(msg, { int }) {
    int++;
    msg.channel.bulkDelete(int, true).catch((err) => {
      console.error(err);
    });
    try {
      msg
        .say(
          `Deletion of messages successful. Total messages deleted: ${int - 1}`
        )
        .then((msgSent) => {
          setTimeout(function () {
            msgSent.delete();
          }, 2000);
        });
    } catch (err) {
      msg.say(`${emoji(msg, "err")} Unable to purge messages.`);
      console.error(err);
    }
  }
};
