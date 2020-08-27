const { Command } = require('discord.js-commando')
const Database = require('../../database/Database');
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
	
	async run(message) {
    const player = await Database.findPlayer(message)

		let expAdd = Helper.randomIntFromInterval(250, 400)
		let pointsAdd = Helper.randomIntFromInterval(400, 600)
    
	}
}