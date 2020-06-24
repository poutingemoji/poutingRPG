module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	aliases: ['serverinfo'],
	cooldown: 2,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};