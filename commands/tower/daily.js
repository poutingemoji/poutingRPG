const { Command } = require('discord.js-commando')
const userStat = require('../../models/userstat')
require('dotenv').config()

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			aliases: [],
			group: 'tower',
			memberName: 'daily',
			description: 'Claim your daily reward.',
			examples: [],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
			args: [],
            throttling: {
                usages: 1,
                duration: 86400
            },
        })
	}

	run(message) {
		let expAdd = randomIntFromInterval(250, 400)
		let pointsAdd = randomIntFromInterval(400, 600)
		
		userStat.findOne({
			userID: message.author.id,
		}, (err, currentUserstat) => {
			let currentExp = currentUserstat.currentExp
			let currentLevel = currentUserstat.level
			let nextLevel = Math.floor(process.env.BASE_EXPMULTIPLIER *(Math.pow(currentLevel, process.env.EXPONENTIAL_EXPMULTIPLIER)))
			currentUserstat.totalExp = currentUserstat.totalExp + expAdd
			currentUserstat.currentExp = currentUserstat.currentExp + expAdd
			if(nextLevel <= currentExp) {
				currentUserstat.level++
				currentUserstat.currentExp = 0
				message.say(`${emoji(message, "729255616786464848")} You are now **Level ${currentLevel + 1}**! ${emoji(message, "729255637837414450")}`)
			}

			currentUserstat.points = currentUserstat.points + pointsAdd

			currentUserstat.save().catch(err => console.log(err))
		})
		message.say(`${emoji(message, "729206897818730567")} **${message.author.username}**, you received your daily reward of **${pointsAdd}** points and **${expAdd}** experience.`)
	}
}

function randomIntFromInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}