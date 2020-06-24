const {color} = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 3,
	usage: '[command name]',
	args: false,
	guildOnly: true,

	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL()}`);
		}
		const avatarList = message.mentions.users.map(user => {
			return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL()}`);
		});
		
		
	},
};