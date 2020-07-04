const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { botUsername, botAvatarURL, prefix } = require("../../config.json");

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
            guildOnly: false,
            args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message) {
        var mentionedMember = message.member;
        var mentionedUser = message.author;
        if (message.mentions.users.first()) {
            mentionedUser = message.mentions.users.first()
            mentionedMember = message.mentions.members.first()
        }
        const mentionedRoles = [];
        mentionedMember._roles.forEach(role => mentionedRoles.push("<@&" + role + ">"))
        const formattedPermissions = [];
        mentionedMember.permissions.toArray().forEach(permission => formattedPermissions.push(titleCase(permission)))
		const userinfoEmbed = new MessageEmbed()
            .setColor("#ffffff")
            .setAuthor(mentionedUser.tag, mentionedUser.displayAvatarURL())
			.setThumbnail(mentionedUser.displayAvatarURL())
            .addFields(
                { name: "ID", value: mentionedUser.id, inline: true },
                { name: "Nickname", value: mentionedMember.nickname, inline: true },
                { name: 'Created', value: dateFormat(mentionedUser.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), inline: true },
                { name: 'Joined', value: dateFormat(mentionedMember.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"), inline: true },
                { name: "Permissions", value: formattedPermissions.join(', ') },
                { name: "Roles", value: mentionedRoles, inline: true },
            )
            .setTimestamp()
            .setFooter(botUsername , botAvatarURL);
		message.channel.send(userinfoEmbed);
    };
};

function titleCase(str) {
    str = str.replace(/_/g, " ")
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }