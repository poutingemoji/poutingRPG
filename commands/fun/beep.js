module.exports = {
	name: 'beep',
	description: 'Beep boop. Beep Boop.',
	aliases: ['orgasm'],
	cooldown: 3,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message) {
		async function editMessage() {
			try {
				const sentMessage = await message.channel.send("Beep");
					setTimeout(function(){
						sentMessage.edit("Boop");
						sentMessage.react("🤖");
					}, 4000)
			} catch(error) {
				return console.log("didnt edit message")
			}
		}
		editMessage()
	},
};