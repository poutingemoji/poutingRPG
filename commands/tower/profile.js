const { Command } = require("discord.js-commando")
const { MessageAttachment } = require("discord.js")
const { createCanvas, loadImage } = require("canvas")
const playerSchema = require("../../database/schemas/player")
require('dotenv').config()

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: "profile",
			aliases: [],
			group: "tower",
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
		playerSchema.findOne({
			discordId: user.id,
		}, (err, player) => {
			if (err) console.log(err)
			if (!player) {
				createImage(
					0, // currentExp
					1, // currentLevel
					0, // currentPoints
					"No Position", // currentPosition
					false, // currentIrregular
					"F-RANK 5", // currentRank
					2, // nextLevel
					[],
					user,
					message
				)
			} else {
				createImage(
					player.currentExp, 
					player.level, 
					player.points, 
					player.position, 
					player.irregular, 
					`7D-rank`, // currentRank
					Math.floor(process.env.BASE_EXPMULTIPLIER * (Math.pow(player.level, process.env.EXPONENTIAL_EXPMULTIPLIER))), // nextLevel
					player.badges,
					user,
					message
				)
			}
		})
	}
}

async function createImage(currentExp, currentLevel, currentPoints, currentPosition, currentIrregular, currentRank, nextLevel, currentBadges, user, message) {
	const canvas = createCanvas(934, 282)
	const ctx = canvas.getContext("2d")
	//ctx, x, y, width, height, radius, fill, fillColor
	roundRect(ctx, 0, 0, canvas.width, canvas.height, 10, "#23272A")

	let currentPositionColor = process.env['POSITION_COLOR_' + currentPosition.toUpperCase().replace(/ /g, "_")]
	if (currentPosition == "No Position") {
		currentPositionColor = "#ffffff"
	}
	//ctx, x, y, width, height, radius, exp, level
	expBar(ctx, 264, 210, 642, 45, 20, currentExp, nextLevel, currentPositionColor)

	//ctx, x, y, text, font, textAlignment, color
	textBox(ctx, 270, 197, user.tag, "32px Arial", "left", "white")
	textBox(ctx, 270, 45, currentPosition.toUpperCase(), "bold 32px Arial", "left", currentPositionColor)
	textBox(ctx, 270, 80, currentRank, "32px Arial", "left", "white")
	if (currentIrregular) {
		textBox(ctx, 270, 166, "IRREGULAR", "oblique 32px Arial", "left", "#525252")
	}

	let badgePosition = 267
	for (let badge = 0; badge < 6; badge++) {
		let badgeState = badges[badge][1]
		if (currentBadges.includes(badge)) badgeState = badges[badge][0]
		const badgeImage = await loadImage(badgeState)
		ctx.drawImage(badgeImage, badgePosition, 91, 40, 40)
		badgePosition = badgePosition + 44
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

const badges = [
	['https://cdn.discordapp.com/attachments/722720878932262952/733574768749576202/Skull.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733582850015756316/NoSkull.png'],
	['https://cdn.discordapp.com/attachments/722720878932262952/733575603298631771/Wave.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733583567237677086/NoWave.png'],
	['https://cdn.discordapp.com/attachments/722720878932262952/733574457490145330/Door.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733582480044720197/NoDoor.png'],
	['https://media.discordapp.net/attachments/722720878932262952/733574476280758403/Crown.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733581893832015983/NoCrown.png'],
	['https://cdn.discordapp.com/attachments/722720878932262952/733575199898861628/Monkey.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733583104974782524/NoMonkey.png'],
	['https://cdn.discordapp.com/attachments/722720878932262952/733575390731173938/FishingPole.png',
	'https://cdn.discordapp.com/attachments/722720878932262952/733583373238534164/NoFishingPole.png'],
]

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

	if (status === "online") {
		ctx.fillStyle = "#44b37f"
	} else if (status === "idle") {
		ctx.fillStyle = "#f9a51c"
	} else if (status === "dnd") {
		ctx.fillStyle = "#f04848"
	} else if (status === "offline") {
		ctx.fillStyle = "#747f8d"
	}
	ctx.fill()
}

function textBox(ctx, x, y, text, font, textAlignment, textColor) {
	ctx.font = font
	ctx.textAlign = textAlignment
	ctx.fillStyle = textColor
	ctx.fillText(text, x, y)
}