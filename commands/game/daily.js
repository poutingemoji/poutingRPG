const { Command } = require('discord.js-commando')
const playerSchema = require('../../database/schemas/player')
const Helper = require('../../utils/Helper')
require('dotenv').config()

module.exports = class DailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			aliases: [],
			group: 'game',
			memberName: 'daily',
			description: 'Claim your daily reward.',
			examples: [],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
			args: [],
      throttling: {
        usages: 1,
        duration: 86000
      },
    })

	}
	
	run(message) {
		let expAdd = Helper.randomIntFromInterval(250, 400)
		let pointsAdd = Helper.randomIntFromInterval(400, 600)
		
		playerSchema.findOne({
			playerId: message.author.id,
		}, (err, player) => {
			let currentExp = player.currentExp
			let currentLevel = player.level
			let nextLevel = Math.floor(process.env.BASE_EXPMULTIPLIER *(Math.pow(currentLevel, process.env.EXPONENTIAL_EXPMULTIPLIER)))
			player.totalExp = player.totalExp + expAdd
			player.currentExp = player.currentExp + expAdd
			if(nextLevel <= currentExp) {
				player.level++
				player.currentExp = 0
				message.say(`${Helper.emoji(message, "729255616786464848")} You are now **Level ${currentLevel + 1}**! ${Helper.emoji(message, "729255637837414450")}`)
			}

			player.points = player.points + pointsAdd

			player.save().catch(err => console.log(err))
		})
		message.say(Helper.emojiMsg(message, "left", ["res"], `you received your daily reward of **${pointsAdd}** points and **${expAdd}** experience.`, true))
	}
}