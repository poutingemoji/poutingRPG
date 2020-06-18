module.exports = {
	name: 'orgasm',
	description: 'Beep!',
	cooldown: 3,
	execute(message) {
		message.channel.send("**Gon:** If I can't escape, I will attack!")
		async function editMessage() {
			try {
				const sentMessage = await message.channel.send("⭐♠🤡❤️⭐: OOoooooouuuuhhhhhhhhh! Ouuuuhhhhhhhhhh")
					setTimeout(function(){
						sentMessage.edit("⭐♠🤡❤️⭐: *moans* dame dame gon")
						message.channel.send("https://tenor.com/view/hisoka-hunterx-hunter-orgasm-anime-gif-17216897")
					}, 4000)
			} catch(error) {
				return console.log("didnt edit message")
			}
		}
		editMessage()
	},
};