module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: [],
	cooldown: 5,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};