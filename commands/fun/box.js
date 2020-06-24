module.exports = {
	name: 'box',
	description: 'uhhh... eee urrr?',
	aliases: [],
	cooldown: 0,
	usage: '[command name]',
	args: false,
	guildOnly: true,

	execute(message) {
		async function editMessage() {
			try {
				const sentMessage = await message.channel.send("Eeee")
					setTimeout(function(){
						sentMessage.edit("Urrr")
						sentMessage.react("📦")
						message.channel.send("https://tenor.com/view/perfect-piano-r501-lick-with-abox-roddy-ricch-the-box-gif-17019369")
					}, 1500)
			} catch(error) {
				return console.log("didnt edit message")
			}
		}
		editMessage()
	},
};