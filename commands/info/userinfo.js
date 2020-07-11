const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix, color } = require("../../config.json");

module.exports = class UserinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			aliases: ['ui', 'whois'],
			group: 'info',
			memberName: 'userinfo',
            description: "Shows your info or the user you mentioned's info",
            examples: [`${prefix}userinfo [@user]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message) {
        let mentionedMember = message.member;
        let mentionedUser = message.author;
        if (message.mentions.users.first()) {
            mentionedUser = message.mentions.users.first()
            mentionedMember = message.mentions.members.first()
        }
        const mentionedRoles = mentionedMember._roles.map(role => "<@&" + role + ">").join(" ");
        const mentionedPermissions = mentionedMember.permissions.toArray().map(permission => titleCase(permission)).join(', ')
		const userinfoEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL())
			.setThumbnail(mentionedUser.displayAvatarURL())
            .setTimestamp()
            .setFooter(`ID: ${mentionedUser.id}`);
        if (mentionedMember.nickname) {
            userinfoEmbed.addField("Nickname", mentionedMember.nickname, true)
        }
        userinfoEmbed.addField("Created", dateFormat(mentionedUser.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), true)
        userinfoEmbed.addField("Joined", dateFormat(mentionedMember.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), true)
        if (mentionedPermissions) {
            userinfoEmbed.addField(`Permissions (${mentionedPermissions.split(', ').length})`, mentionedPermissions)
        }
        if (mentionedRoles) {
            userinfoEmbed.addField(`Roles (${mentionedRoles.split(' ').length})`,  mentionedRoles)
        }
		message.say(randomTip(message, userinfoEmbed));
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