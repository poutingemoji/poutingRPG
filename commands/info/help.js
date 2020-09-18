require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const {
  disambiguation,
  titleCase,
  secondsToDhms,
} = require("../../utils/Helper");
const { commandInfo } = require("../../utils/msgHelper");
const { links, embedColors } = require("../../utils/enumHelper");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      aliases: ["commands", "invite"],
      group: "info",
      memberName: "help",
      description: "Shows the command list.",
      examples: [`${client.commandPrefix}help`],
      clientPermissions: [],
      userPermissions: [],
      args: [
        {
          key: "command",
          prompt: "Which command would you like to view the help for?",
          type: "string",
          default: "",
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }
  async run(msg, args) {
    const commands = this.client.registry.findCommands(
      args.command,
      false,
      msg
    );
    const showAll = args.command && args.command.toLowerCase() === "all";
    if (args.command && !showAll) {
      if (commands.length === 1) {
        return commandInfo(msg, commands[0]);
      } else if (commands.length > 15) {
        return msg.reply("Multiple commands found. Please be more specific.");
      } else if (commands.length > 1) {
        return msg.reply(disambiguation(commands, "commands"));
      } else {
        return msg.reply(
          `Unable to identify command. Use ${msg.usage(
            null,
            msg.channel.type === "dm" ? null : undefined,
            msg.channel.type === "dm" ? null : undefined
          )} to view the list of all commands.`
        );
      }
    } else {
      const messages = [];
      try {
        const commandPrefix = msg.guild
          ? msg.guild.commandPrefix
          : msg.client.commandPrefix;
        const messageEmbed = new MessageEmbed()
          .setColor(embedColors.bot)
          .setAuthor(
            msg.client.user.username,
            msg.client.user.displayAvatarURL()
          )
          .addFields(
            {
              name: "Commands",
              value:
                "You can view a full list of the commands here: https://poutingemoji.github.io/poutingbot/commands.html",
            },
            {
              name: "Prefix",
              value: `
              Current prefix of ${
                msg.guild ? `__**${msg.guild}**__` : "this DM"
              } is \`${commandPrefix}\`
              To use a command, write the prefix followed by the command name. 
              Example: \`${commandPrefix}help\`
            `,
            },
            {
              name: "More Command Info",
              value: `
              To get more information on a specific command, use \`${commandPrefix}help [command]\`
              Example: \`${commandPrefix}help start\`
            `,
            },
            {
              name: "Useful Links",
              value: `
              **Command List**: ${links.commandlist}
              **Website**: ${links.website}
              **Support Server**: ${links.supportserver}
            `,
            }
          );
        messages.push(await msg.say(messageEmbed));
      } catch (err) {
        console.log(err);
        messages.push(
          await msg.reply(
            "Unable to send you the help DM. You probably have DMs disabled."
          )
        );
      }
      return messages;
    }
  }
};
