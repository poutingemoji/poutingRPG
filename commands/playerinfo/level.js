const Discord = require('discord.js')
const { MessageAttachment } = Discord
const { join } = require(path)
const {color} = require('../../config.json');
const { createCanvas, loadImage } = require('canvas')

let xp = require('../../xp.json');
module.exports = {
	name: 'level',
	aliases: ['rank'],
	description: 'check ur current level.',
	guildOnly: true,
	cooldown: 3,
	execute(message) {
		console.log('executed')
		let user
		if (message.mentions.users.first()) {
			user = message.mentions.users.first();
		} else {
			user = message.author;
		}

		if(!xp[message.author.id]) {
			xp[message.author.id] == {
				xp: 0,
				level: 1
			}
		}

		let curxp = xp[message.author.id].xp
		let curlevel = xp[message.author.id].level
		let nxtLevelXP = curlevel * 300
		let difference = nxtLevelXP - curxp
		
		const canvas = createCanvas(1000, 333)
		const ctx = canvas.getContext('2d')
		const background = await loadImage(`https://cdn.discordapp.com/attachments/722720878932262952/723017703581024346/Main_position_7.png`)
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		ctx.beginPath()
		ctx.lineWidth = 4
		ctx.strokeStyle = '#ffffff'
		ctx.globalAlpha = 0.2
		ctx.fillStyle = '#000000'
		ctx.fillRect(180, 216, 770, 65)
		ctx.fill()
		ctx.globalAlpha = 1
		ctx.strokeRect(100, 216, 770, 65)
		ctx.stroke()

		ctx.fillStyle = "#e67e22"
		ctx.globalAlpha = 0.6
		ctx.fillRect(180, 216, ((100 / curlevel * 300) * curxp) * 7.7, 65)
		ctx.fill()
		ctx.globalAlpha = 1

		ctx.font = "30px Arial"
		ctx.textAlign = "center"
		ctx.fillStyle = '#ffffff'
		ctx.fillText(`${curxp} / ${curlevel * 300} XP`, 600, 260)

		ctx.textAlign = 'left'
		ctx.fillText(user.username, 300, 120)

		ctx.font = '50px Arial'
		ctx.fillText('Level:', 300, 180)
		ctx.fillText(curlevel, 470, 180)

		ctx.arc(170, 160, 120, 0, Math.PI *2, true)
		ctx.lineWidth = 6
		ctx.strokeStyle = '#ffffff'
		ctx.stroke()
		ctx.closePath()
		ctx.clip()
		const avatar = await loadImage(member.user.displayAvatarURL())
		ctx.drawings(avatar, 40, 40, 250, 250)

		const attachment = new MessageAttachment(canvas.toBuffer(), 'rank.png')
		message.channel.send(`${user.username}'s Rank`, attachment)
	},
};