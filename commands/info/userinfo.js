const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix, color } = require("../../config.json");

module.exports = class UserinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			aliases: ['whois'],
			group: 'info',
			memberName: 'userinfo',
            description: "Display the user mentioned's info.",
            examples: [`${prefix}userinfo [@user/id]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to get info on?',
                    type: 'user',
                    default: false,
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message, {user}) {
        const mentionedUser = user || message.author
        const mentionedMember = message.guild.member(user) || message.member
        const mentionedRoles = mentionedMember._roles.map(role => "<@&" + role + ">").join(" ");
        const mentionedPermissions = mentionedMember.permissions.toArray().map(permission => titleCase(permission)).join(', ')
		const messageEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL())
			.setThumbnail(mentionedUser.displayAvatarURL())
            .setTimestamp()
            .setFooter(`ID: ${mentionedUser.id}`);
        if (mentionedMember.nickname) {
            messageEmbed.addField("Nickname", mentionedMember.nickname, true)
        }
        messageEmbed.addField("Created", dateFormat(mentionedUser.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), true)
        messageEmbed.addField("Joined", dateFormat(mentionedMember.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), true)
        if (mentionedPermissions) {
            messageEmbed.addField(`Permissions (${mentionedPermissions.split(', ').length})`, mentionedPermissions)
        }
        if (mentionedRoles) {
            messageEmbed.addField(`Roles (${mentionedRoles.split(' ').length})`,  mentionedRoles)
        }
		message.say(messageEmbed);
    };
};

function titleCase(str) {
    str = str.replace(/_/g, " ")
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}