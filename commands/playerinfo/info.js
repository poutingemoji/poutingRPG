const {color} = require('../../config.json');
const Discord = require('discord.js');
const dateFormat = require('dateformat')

module.exports = {
	name: 'info',
	description: 'Display info about yourself.',
	aliases: [],
	cooldown: 2,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message) {
		let user;
		if (message.mentions.users.first()) {
			user = message.mentions.users.first();
		} else {
			user = message.author;
		}
		
		const member = message.guild.member(user);
		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setThumbnail(user.displayAvatarURL())
			.setAuthor(user.username + ' | ' + user.id)
			.addField("Account Created On:", `${dateFormat(user.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`) 
			.addField("Joined The Server On:", `${dateFormat(member.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
			.addField("Status:", `${user.presence.status}`, true)
			.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
		message.channel.send({embed});
	},
};