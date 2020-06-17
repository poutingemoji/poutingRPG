module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	execute(message) {
		if (message === 'avatar') {
			if (!message.mentions.users.size) {
				return message.channel.send(`Your avatar: ${message.author.displayAvatarURL()}`);
			}
		}
	},
};