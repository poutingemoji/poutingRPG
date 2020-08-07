const { Command } = require('discord.js-commando')
const UserSchema = require('../../models/userschema')
const typ = require('../../helpers/typ')
const int = require('../../helpers/int')
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
                duration: 82800
            },
        })
	}
	
	run(message) {
		let expAdd = int.randomIntFromInterval(250, 400)
		let pointsAdd = int.randomIntFromInterval(400, 600)
		
		UserSchema.findOne({
			userId: message.author.id,
		}, (err, USER) => {
			let currentExp = USER.currentExp
			let currentLevel = USER.level
			let nextLevel = Math.floor(process.env.BASE_EXPMULTIPLIER *(Math.pow(currentLevel, process.env.EXPONENTIAL_EXPMULTIPLIER)))
			USER.totalExp = USER.totalExp + expAdd
			USER.currentExp = USER.currentExp + expAdd
			if(nextLevel <= currentExp) {
				USER.level++
				USER.currentExp = 0
				message.say(`${typ.emoji(message, "729255616786464848")} You are now **Level ${currentLevel + 1}**! ${typ.emoji(message, "729255637837414450")}`)
			}

			USER.points = USER.points + pointsAdd

			USER.save().catch(err => console.log(err))
		})
		message.say(typ.emojiMsg(message, ["result"], `you received your daily reward of **${pointsAdd}** points and **${expAdd}** experience.`, true))
	}
}