require('dotenv').config()
const { Command } = require('discord.js-commando')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');

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
        duration: 82800
      },
    })
	}
	
	async run(message) {
    const player = await Database.findPlayer(message, message.author)
    const exp = Helper.randomIntFromInterval(250, 400)
    const points = Helper.randomIntFromInterval(400, 600)
    await Database.addExpPlayer(message, message.author, exp)
    await Database.incrementValuePlayer(message.author.id, 'points', points)
    message.say(`${message.author.username}, you've received your daily **${exp}** ✨ exp & your daily **${points}** ⛳ points.`)
	}
}