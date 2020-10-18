//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");
const dateFormat = require("dateformat");

//DATA
require("dotenv").config();

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class ProfileCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "profile",
      aliases: [],
      group: "game",
      memberName: "profile",
      description: "View someone's profile.",
      examples: [`${client.commandPrefix}profile [@user/id]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
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
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await findPlayer(user, msg);
    const arc = Arcs[player.arc];
    const profile = {
      ["Level"]: player.level,
      ["EXP"]: `${player.EXP}/${player.Max_EXP}`,
      ["Points"]: player.points,
    };
    let description = "";

    for (let key in profile) {
      description += `${key}: **${profile[key]}**\n`;
    }

    const messageEmbed = new MessageEmbed()
      .setTitle(`${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(description)
      .setFooter(
        `Born: ${dateFormat(
          player._id.getTimestamp(),
          "dddd, mmmm dS, yyyy, h:MM TT"
        )}`
      );
    msg.say(messageEmbed);
  }
};
