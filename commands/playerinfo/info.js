const {color} = require('../../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
function getMemberPosition() {
	message.guild.members.cache
}
module.exports = {
	name: 'info',
	description: 'Display info about yourself.',
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
			.addField("Account Created On:", `${user.createdAt}`) 
			.addField("Joined The Server On:", `${member.joinedAt}`)
			.addField("Status:", `${user.presence.status}`, true)
			.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
		message.channel.send({embed});
	},
};