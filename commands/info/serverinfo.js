const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix, color } = require("../../config.json");

module.exports = class ServerinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'serverinfo',
			aliases: [],
			group: 'info',
			memberName: 'serverinfo',
            description: "Displays info about the server.",
            examples: [`${prefix}serverinfo`],
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
        let guild = message.guild;
        const members = guild.members.cache.map(member => member)
        const membersOnline = (members.filter(member => member.user.presence.status !== 'offline')).length
        const membersOffline = members.length - membersOnline
        const channels = guild.channels.cache.map(channel => channel)
        const textChannelCount = (channels.filter(channel => channel.type === "text")).length
        const voiceChannelCount = (channels.filter(channel => channel.type === "voice")).length
        const botCount = (members.filter(member => member.user.bot)).length
        const humanCount = members.length - botCount
        const roles = guild.roles.cache.map(role => "<@&" + role.id + ">");
        const emojis = guild.emojis.cache.map(emoji => emoji)
		const messageEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor(guild.name)
			.setThumbnail(guild.iconURL())
            .addFields(
                { name: "Server Owner", value: guild.owner, inline: true },
                { name: "Created", value: dateFormat(guild.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT") },
                { name: "Region", value: guild.region, inline: true },
                { name: 'Members\n(Total/Online/Offline)', value: guild.memberCount + "/" + membersOnline + "/" + membersOffline },
                { name: 'Channels\n(Text/Voice)', value: textChannelCount + "/" + voiceChannelCount },
                { name: "Humans/Bots", value: humanCount + "/" + botCount, inline: true },
            )
            .setTimestamp()
            .setFooter(`ID: ${guild.id}`);
        if (roles) {
            messageEmbed.addField("Roles", roles.length, true)
        }
        if (emojis) {
            messageEmbed.addField(`Emojis (${emojis.length})`, emojis.slice(0, 20).join(' '))
        }
		message.say(messageEmbed)
    };
};