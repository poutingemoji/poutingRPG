const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const hfuncs = require('../../functions/helper-functions')
require('dotenv').config()

module.exports = class TopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top',
			aliases: ['leaderboard'],
			group: 'tower',
			memberName: 'top',
			description: 'Displays the top players.',
			examples: [`${process.env.PREFIX}top [level/points]`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
            args: [
                {
                    key: 'filter',
                    prompt: "Level or Points?",
					type: 'string',
					oneOf: ['level', 'points'],
                },
            ],
            throttling: {
                usages: 1,
                duration: 4
            },
        })
	}

	hasPermission(message) {
        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
			if (!currentUserstat) {
				message.say(`${hfuncs.emoji(message, "729190277511905301")} **${message.author.username}**, you haven't been registered into the Tower. Use \`${message.client.commandPrefix}start\` to begin your climb.`)
				return false
			}
			return true
        })
	}
	
	run(message, filter) {
		filter = filter['filter']
		const checkDict = {
			['level'] : 'totalExp',
			['points'] : 'points',
		}
		Userstat.find()
		.sort([
			[checkDict[filter], 'descending']
		  ]).exec((err, res) => {
			if (err) console.log(err)

			let leaderboardMaxUsers = 10
			if (res.length < leaderboardMaxUsers) leaderboardMaxUsers = res.length 
			let topPlayers = ''
			const messageEmbed = new MessageEmbed()
				.setColor('#2f3136')
				.setTitle(`Global Leaderboard [${hfuncs.titleCase(filter)}]`)
			async function getUser() {
				try {
					for (let i = 0; i < leaderboardMaxUsers; i++) {
						let leaderboardPosition
						const medals = ['🥇','🥈','🥉']
						if (i < 3) {
							leaderboardPosition = medals[i]
						} else {
							leaderboardPosition = i + 1
						}
						const user = await message.client.users.fetch(res[i].userId)
						if (filter === 'level') {
							topPlayers += leaderboardPosition + ` **${user.username}** ─ ${hfuncs.titleCase(filter)}: ${res[i].level} ─ Exp: ${res[i].totalExp}\n`
						} else {
							topPlayers += leaderboardPosition + `  **${user.username}** ─ ${hfuncs.titleCase(filter)}: ${res[i].points}\n`
						}
					}
					messageEmbed.setDescription(topPlayers)
					message.say(messageEmbed)
				} catch(error) {
					console.log(error)
				}
			}
			getUser()
		})
	}
}