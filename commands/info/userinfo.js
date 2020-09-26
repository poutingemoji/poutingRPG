require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { titleCase } = require("../../utils/helpers/strHelper");

const dateFormat = require("dateformat");

module.exports = class UserinfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      aliases: ["whois"],
      group: "info",
      memberName: "userinfo",
      description: "Display the user mentioned's info.",
      examples: [`${client.commandPrefix}userinfo [@user/id]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "Who would you like to get info on?",
          type: "user",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }
  run(msg, { user }) {
    const mentionedUser = user || msg.author;
    const mentionedMember = msg.guild.member(user) || msg.member;
    const mentionedRoles = mentionedMember._roles
      .map((role) => "<@&" + role + ">")
      .join(" ");
    const mentionedPermissions = mentionedMember.permissions
      .toArray()
      .map((permission) => titleCase(permission))
      .join(", ");
    const messageEmbed = new MessageEmbed()
      .setColor("#92b096")
      .setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL())
      .setThumbnail(mentionedUser.displayAvatarURL())
      .setTimestamp()
      .setFooter(`ID: ${mentionedUser.id}`);
    if (mentionedMember.nickname) {
      messageEmbed.addField("Nickname", mentionedMember.nickname, true);
    }
    messageEmbed.addField(
      "Created",
      dateFormat(mentionedUser.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
      true
    );
    messageEmbed.addField(
      "Joined",
      dateFormat(mentionedMember.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
      true
    );
    if (mentionedPermissions) {
      messageEmbed.addField(
        `Permissions (${mentionedPermissions.split(", ").length})`,
        mentionedPermissions
      );
    }
    if (mentionedRoles) {
      messageEmbed.addField(
        `Roles (${mentionedRoles.split(" ").length})`,
        mentionedRoles
      );
    }
    msg.say(messageEmbed);
  }
};
