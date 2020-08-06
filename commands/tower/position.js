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
		}, (err, USERSTAT) => {
			if (err) console.log(err)
			USERSTAT.position = position.Name
			USERSTAT.irregular = isIrregular
			USERSTAT.rank = rankIndex
			if (USERSTAT.badges.includes(badge) === false) {
				USERSTAT.badges.push(badge)
				console.log(badge)
			}
			USERSTAT.save().catch(err => console.log(err))
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