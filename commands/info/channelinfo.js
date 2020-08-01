const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const dateFormat = require('dateformat')
require('dotenv').config()

module.exports = class ChannelinfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'channelinfo',
			aliases: [],
			group: 'info',
			memberName: 'channelinfo',
            description: "Displays info about the mentioned channel.",
            examples: [`${process.env.PREFIX}channelinfo`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
    }
    run(message) {
        let channel = message.channel
        console.log(message.mentions.channels.first())
        if (message.mentions.channels.first()) {
            channel = message.mentions.channels.first()
        }
		const messageEmbed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setThumbnail("https://cdn.discordapp.com/attachments/722720878932262952/729916844017713182/Green_april_hook_shape.png")
            .addFields(
                { name: "Channel Name", value: "<#" + channel.id + ">"},
                { name: "Created", value: dateFormat(channel.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT") },
                { name: "Channel Type", value: channel.type, inline: true },
                { name: 'Position', value: channel.position, inline: true  },
            )
            .setTimestamp()
            .setFooter(`ID: ${channel.id}`)
        if (channel.topic) {
            messageEmbed.addField("Topic", channel.topic)
        }
		message.say(messageEmbed)
    }
}