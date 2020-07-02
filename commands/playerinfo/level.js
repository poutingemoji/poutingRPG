const fs = require('fs');
const Discord = require('discord.js')
const { createCanvas, loadImage } = require('canvas')
const { MessageAttachment } = Discord
const { color, positionColors } = require('../../config.json');

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://poutingemoji:ILive4God@cluster0-gm8vk.mongodb.net/user-stats', {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
const userStats = require('../../models/userstat')

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

function expBar(ctx, x, y, width, height, radius, currentExp, currentLevel, nextLevel, expBarColor) {
	roundRect(ctx, x, y, width, height, radius, true, "#999999")
	if (currentExp > (nextLevel/10)) {
		roundRect(ctx, x, y, (currentExp / (currentLevel * 300)) * width, height, radius, true, expBarColor)
	}
}

function circleAvatar(ctx, x, y, diameter, avatar, status) {
	ctx.save()

	ctx.beginPath();
	ctx.arc(x + 95, y + 94, diameter / 2, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, x, y, diameter, diameter)

	ctx.restore()

	ctx.beginPath();
	ctx.arc(x + 160, y + 162, 21, 0, 2 * Math.PI);
	ctx.lineWidth = 7;
	ctx.strokeStyle = "#23272A";
	ctx.stroke();

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
}

function textBox(ctx, x, y, text, font, textAlignment, textColor) {
	ctx.font = font
	ctx.textAlign = textAlignment
	ctx.fillStyle = textColor
	ctx.fillText(text, x, y)
}

module.exports = {
	name: 'level',
	description: 'check ur current level.',
	aliases: ['rank', 'pocket'],
	cooldown: 2,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message) {
		let user
		if (message.mentions.users.first()) {
			user = message.mentions.users.first()
			if (user.bot) return
		} else {
			user = message.author;
		}

		async function createImage() {
			console.log(currentPosition)
			const canvas = createCanvas(934, 282)
			const ctx = canvas.getContext('2d');
			//ctx, x, y, width, height, radius, fill, fillColor
			roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, true, "#23272A")
			let currentPositionColor = positionColors[currentPosition]
			if (currentPosition == 'No Position') {
				currentPositionColor = '#ffffff'
			}
			//ctx, x, y, width, height, radius, exp, level
			expBar(ctx, 264, 210, 642, 45, 20, currentExp, currentLevel, nextLevel, currentPositionColor)

			//ctx, x, y, text, font, textAlignment, color
			textBox(ctx, 270, 197, user.username, '32px Arial', 'left', 'white')
			textBox(ctx, 270, 45, currentPosition.toUpperCase(), 'bold 32px Arial', 'left', currentPositionColor)
			textBox(ctx, 270, 80, currentRank, '32px Arial', 'left', 'white')
			textBox(ctx, 270, 115, `POINTS ${currentPoints}`, '32px Arial', 'left', 'white')
			if (currentIrregular) {
				textBox(ctx, 270, 150, 'IRREGULAR', 'oblique 32px Arial', 'left', "#525252")
			}
			textBox(ctx, 895, 45, `LEVEL ${currentLevel}`, '32px Arial', 'right', 'white')


			textBox(ctx, 895, 197, `${currentExp} / ${nextLevel} XP`, '25px Arial', 'right', "white")
			//ctx, x, y, radius, avatar
			const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }))
			const status = user.presence.status
			circleAvatar(ctx, 36, 48, 190, avatar, status)

			const attachment = new MessageAttachment(canvas.toBuffer(), 'rank.png')
			message.channel.send(`Opening your pocket...`, attachment);
		}

		let totalExp
		let currentExp
		let currentLevel
		let currentPoints
		let currentPosition 
		let currentIrregular 
		let currentRank 
		let nextLevel 

		userStats.findOne({
			userID: user.id,
		}, (err, currentUserStats) => {
			if (err) console.log(err);
			if (!currentUserStats) {
				currentExp = 0
				currentLevel = 1
				currentPosition = 'No Position'
				currentIrregular = false
			} else {
				totalExp = currentUserStats.totalExp
				currentExp = currentUserStats.currentExp
				currentLevel = currentUserStats.level
				currentPoints = currentUserStats.points
				currentPosition = currentUserStats.position
				currentIrregular = currentUserStats.irregular
				const ranks = ['A', 'B', 'C', 'D', 'E', 'F']
				const rankIndex = currentUserStats.rank
				const rankLetter = ranks[Math.ceil(rankIndex/5) - 1]
				let rankNumber = rankIndex % 5
				if (rankNumber == 0) {
					rankNumber = 5
				}
				currentRank = `${rankLetter}-RANK ${rankNumber}`
				nextLevel = Math.floor(100 *(Math.pow(currentLevel, 1.04)))
			} 
			createImage()
		})
	},
};
