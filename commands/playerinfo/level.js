const Discord = require('discord.js')
const { createCanvas, loadImage } = require('canvas')
const { MessageAttachment } = Discord
const { color } = require('../../config.json');


let xp = require('../../xp.json');
module.exports = {
	name: 'level',
	aliases: ['rank', 'pocket'],
	description: 'check ur current level.',
	guildOnly: true,
	cooldown: 3,
	execute(message) {
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
		
		async function createImage() {
			const canvas = createCanvas(311, 142)
			const ctx = canvas.getContext('2d');
			const background = await loadImage(`https://cdn.discordapp.com/attachments/722720878932262952/723017703581024346/Main_position_7.png`)
			ctx.drawImage(background, 0 , 0, canvas.width, canvas.height)
			// Since the image takes time to load, you should await it


            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.strokeStyle = '#ffffff'
            ctx.globalAlpha = 0.2
            ctx.fillStyle = '#23272A'
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

            ctx.font = "16px Arial"
            ctx.textAlign = "center"
            ctx.fillStyle = '#ffffff'
            ctx.fillText(`${curxp} / ${curlevel * 300} XP`, 170, 62)

            ctx.textAlign = 'left'
            ctx.fillText(user.username, 100, 20)

            ctx.font = '16px Arial'
			ctx.fillText('Level:', 100, 41)
			//x, y,
            ctx.fillText(curlevel, 143, 41)
			//x, y,
			const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }))
			ctx.drawImage(avatar, 5, 5, 85, 85)
			//x, y, width, height
			const attachment = new MessageAttachment(canvas.toBuffer(), 'rank.png')
			message.channel.send(`Opening your pocket...`, attachment);
		}
		createImage()
	},
};

// 