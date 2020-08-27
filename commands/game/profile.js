const { Command } = require("discord.js-commando")
const { MessageAttachment } = require("discord.js")
const { createCanvas, loadImage } = require("canvas")
const Database = require('../../database/Database');
require('dotenv').config()

const positions = require('../../docs/data/positions.js')

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: "profile",
			aliases: [],
			group: "game",
			memberName: "profile",
			description: "Displays your profile.",
			examples: [`${process.env.PREFIX}profile [@user/id]`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: `Who's profile would you like to see?`,
					type: 'user',
					default: false,
        },
      ],
			throttling: {
				usages: 1,
				duration: 5
			},
    })
    
	}
	
	async run(message, {user}) {
		user = user || message.author
    if (user.bot) return
    const player = await Database.findPlayer(user)
    createImage(
      player.exp, 
      player.level, 
      player.points, 
      player.position, 
      player.irregular, 
      `7D-rank`, // currentRank
      player.expMax, // nextLevel
      user,
      message
    )
  }
}

async function createImage(currentExp, currentLevel, currentPoints, currentPosition, currentIrregular, currentRank, nextLevel, user, message) {
	const canvas = createCanvas(934, 282)
	const ctx = canvas.getContext("2d")
	//ctx, x, y, width, height, radius, fill, fillColor
	roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, "#23272A")

  currentPosition = positions[currentPosition].name

	let currentPositionColor = process.env['POSITION_COLOR_' + currentPosition]
	if (currentPosition == "No Position") {
		currentPositionColor = "#ffffff"
	}
	//ctx, x, y, width, height, radius, exp, level
	expBar(ctx, 264, 210, 642, 45, 20, currentExp, nextLevel, currentPositionColor)

	//ctx, x, y, text, font, textAlignment, color
	textBox(ctx, 270, 197, user.tag, "32px Arial", "left", "white")
	textBox(ctx, 270, 45, currentPosition, "bold 32px Arial", "left", currentPositionColor)
	textBox(ctx, 270, 80, currentRank, "32px Arial", "left", "white")
	if (currentIrregular) {
		textBox(ctx, 270, 166, "IRREGULAR", "oblique 32px Arial", "left", "#525252")
  }
  
	textBox(ctx, 895, 45, `LEVEL ${currentLevel}`, "32px Arial", "right", "white")
	textBox(ctx, 895, 80, `POINTS ${currentPoints}`, "32px Arial", "right", "white")
	textBox(ctx, 895, 197, `${currentExp} / ${nextLevel} XP`, "25px Arial", "right", "white")

	//ctx, x, y, radius, avatar
	const avatar = await loadImage(user.displayAvatarURL({ format: "jpg" }))
	const status = user.presence.status
	circleAvatar(ctx, 36, 48, 190, avatar, status)

	const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png")
	message.say(attachment)
}

function roundRect(ctx, x, y, width, height, radius, fillStyle) {
	stroke = true
	ctx.beginPath()
	ctx.moveTo(x + radius, y)
	ctx.lineTo(x + width - radius, y)
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
	ctx.lineTo(x + width, y + height - radius)
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
	ctx.lineTo(x + radius, y + height)
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
	ctx.lineTo(x, y + radius)
	ctx.quadraticCurveTo(x, y, x + radius, y)
	ctx.closePath()
 	ctx.fillStyle = fillStyle
	ctx.fill() 
}

function expBar(ctx, x, y, width, height, radius, currentExp, nextLevel, expBarColor) {
	roundRect(ctx, x, y, width, height, radius, "#999999")
	expBarColor = expBarColor || "#ffffff"
	console.log(currentExp, nextLevel)
	if (currentExp > (nextLevel/10)) {
		roundRect(ctx, x, y, (currentExp / nextLevel) * width, height, radius, expBarColor)
	}
}

function circleAvatar(ctx, x, y, diameter, avatar, status) {
	ctx.save()

	ctx.beginPath()
	ctx.arc(x + 95, y + 94, diameter / 2, 0, Math.PI * 2, true)
	ctx.closePath()
	ctx.clip()
	ctx.drawImage(avatar, x, y, diameter, diameter)

	ctx.restore()

	ctx.beginPath()
	ctx.arc(x + 160, y + 162, 21, 0, 2 * Math.PI)
	ctx.lineWidth = 7
	ctx.strokeStyle = "#23272A"
	ctx.stroke()

  const statuses = {
    'online': '#44b37f',
    'idle': '#f9a51c',
    'dnd': '#f04848',
    'offline': '#747f8d',
  }
	ctx.fillStyle = statuses[status]
	ctx.fill()
}

function textBox(ctx, x, y, text, font, textAlignment, textColor) {
	ctx.font = font
	ctx.textAlign = textAlignment
	ctx.fillStyle = textColor
	ctx.fillText(text, x, y)
}