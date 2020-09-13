require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const dateFormat = require('dateformat')

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
  run(msg) {
    let channel = msg.channel
    console.log(msg.mentions.channels.first())
    if (msg.mentions.channels.first()) {
        channel = msg.mentions.channels.first()
    }
		const messageEmbed = new MessageEmbed()
      .setColor('#92b096')
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
		msg.say(messageEmbed)
  }
}