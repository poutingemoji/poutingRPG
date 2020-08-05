const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
require('dotenv').config()

module.exports = class PositionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'position',
			aliases: [],
			group: 'tower',
			memberName: 'position',
			description: 'Randomizes your position and rank. (Chance to be an Irregular)',
			examples: [],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
			args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
	}

	hasPermission(message) {
        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
			if (!currentUserstat) {
				message.say(`${emoji(message, "729190277511905301")} **${message.author.username}**, you haven't been registered into the Tower. Use \`${message.client.commandPrefix}start\` to begin your climb.`)
				return false
			}
			return true
        })
	}
	
	run(message) {
        const positionIndex = Math.floor(Math.random() * Object.keys(positions).length)
		const position = positions[positionIndex]
		const ranks = ['A', 'B', 'C', 'D', 'E', 'F']
		const rankIndex = Math.floor(Math.random() * 30) + 1
		const rankLetter = ranks[Math.ceil(rankIndex/5) - 1]
		let rankNumber = rankIndex % 5
		if (rankNumber == 0) {
			rankNumber = 5
		}
		const isIrregular = Math.random() >= 0.95
		let description
		if (isIrregular) {
			description = `You will bring great change and chaos to the tower, ${rankLetter}-Rank ${rankNumber} ${position.Name}.`;
		} else {
			description = `You are ${rankLetter}-Rank ${rankNumber} ${position.Name}.`
		}
		const badge = Math.floor(Math.random() * 6)
		const messageEmbed = new MessageEmbed()
			.setColor(process.env['POSITION_COLOR_' + position.Name.toUpperCase().replace(/ /g, "_")])
			.setDescription(description)
			.setImage(position.Image)
		Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
			if (err) console.log(err)
			currentUserstat.position = position.Name
			currentUserstat.irregular = isIrregular
			currentUserstat.rank = rankIndex
			if (currentUserstat.badges.includes(badge) === false) {
				currentUserstat.badges.push(badge)
				console.log(badge)
			}
			currentUserstat.save().catch(err => console.log(err))
		})
		message.say(messageEmbed)
	}
}

const positions = {
    [0] : {
        Name: "Fisherman",
        Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017703581024346/Main_position_7.png",
    },
    [1] : {
        Name: "Scout",
        Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017470788763659/Main_position_6.png",
    },
    [2] : {
        Name: "Spear Bearer",
        Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017114872578098/Main_position_3.png",
    },
    [3] : {
        Name: "Light Bearer",
        Image: "https://cdn.discordapp.com/attachments/722720878932262952/723016426264461393/unknown.png",
    },
    [4] : {
        Name: "Wave Controller",
        Image: "https://cdn.discordapp.com/attachments/722720878932262952/723016677834489906/Main_position_2.png",
    }
}