const Discord = require('discord.js')
const { createCanvas, loadImage } = require('canvas')
const { MessageAttachment } = Discord
const { color } = require('../../config.json');

function roundRect(ctx, x, y, width, height, radius, fill, fillStyle) {
	stroke = true;
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
 	ctx.fillStyle = fillStyle
	ctx.fill();       
}

function expBar(ctx, x, y, width, height, radius, currentExp, currentLevel) {
	roundRect(ctx, x, y, width, height, radius, true, "#525252")
	roundRect(ctx, x, y, (currentExp / (currentLevel * 300)) * width, height, radius, true, "#e67e22")
}

function circleAvatar(ctx, x, y, diameter, avatar, canvas) {
	ctx.beginPath();
	ctx.arc(135, 134, diameter / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, x, y, diameter, diameter)
}

function textBox(ctx, x, y, text, font, textAlignment, textColor) {
	ctx.font = font
	ctx.textAlign = textAlignment
	ctx.fillStyle = textColor
	ctx.fillText(text, x, y)
}

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
			if (user.bot) return
		} else {
			user = message.author;
		}

		if(!xp[message.author.id]) {
			xp[message.author.id] == {
				xp: 0,
				level: 1
			}
		}

		let curxp = xp[user.id].xp
		let curlevel = xp[user.id].level
		let nxtLevelXP = curlevel * 300
		let difference = nxtLevelXP - curxp
		console.log(user.username)
		async function createImage() {
			const canvas = createCanvas(934, 282)
			const ctx = canvas.getContext('2d');
			//ctx, x, y, width, height, radius, fill, fillColor
			roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, true, "#23272A")
		

			//ctx, x, y, width, height, radius, exp, level
			expBar(ctx, 220, 216, 650, 45, 20, curxp, curlevel)
			//ctx, x, y, text, font, textAlignment, color
			textBox(ctx, 300, 50, user.username, '32px Arial', 'left', 'white')
			
			textBox(ctx, 400, 100, 'Level:', '32px Arial', 'left', 'white')
			textBox(ctx, 490, 100, curlevel, '32px Arial', 'left', 'white')

			textBox(ctx, 400, 200, `${curxp} / ${curlevel * 300} XP`, '32px Arial', 'center', 'white')
			//ctx, x, y, radius, avatar
			ctx.save()
			const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }))
			circleAvatar(ctx, 40, 40, 190, avatar)
			ctx.restore()
			ctx.beginPath();
			ctx.arc(100, 75, 25, 0, 2 * Math.PI);
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#23272A";
			ctx.stroke();
			const status = user.presence.status
			console.log(status)
			if (status === 'online') {
				ctx.fillStyle = '#44b37f'
			} else if (status === 'idle') {
				ctx.fillStyle = '#f9a51c'
			} else if (status === 'dnd') {
				ctx.fillStyle = '#f04848'
			} else if (status === 'offline') {
				ctx.fillStyle = '#747f8d'
			}
			
			ctx.fill();


			const attachment = new MessageAttachment(canvas.toBuffer(), 'rank.png')
			message.channel.send(`Opening your pocket...`, attachment);
		}
		createImage()
	},
};

// 