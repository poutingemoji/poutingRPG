require('dotenv').config()
const { Command } = require('discord.js-commando')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const arcs = require('../../docs/data/arcs');

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
    console.log(arcs[0][0].chapters[0].quests)
    const player = await Database.findPlayer(message, message.author)
    const exp = Helper.randomIntFromInterval(250, 400)
    const points = Helper.randomIntFromInterval(375, 600)
    await Database.addExpPlayer(message.author, message, exp)
    await Database.incrementValuePlayer(message.author, 'points', points)
    message.say(`${message.author.username}, you've received your daily **${exp}** ✨ exp & your daily **${points}** ⛳ points.`)
	}
}