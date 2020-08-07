const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const UserSchema = require('../../models/userschema')
const typ = require('../../helpers/typ')
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
	
	run(message, filter) {
		filter = filter['filter']
		const checkDict = {
			['level'] : 'totalExp',
			['points'] : 'points',
		}
		UserSchema.find()
		.sort([
			[checkDict[filter], 'descending']
		  ]).exec((err, res) => {
			if (err) console.log(err)

			let leaderboardMaxUsers = 10
			if (res.length < leaderboardMaxUsers) leaderboardMaxUsers = res.length 
			let topPlayers = ''
			const messageEmbed = new MessageEmbed()
				.setColor('#2f3136')
				.setTitle(`Global Leaderboard [${typ.titleCase(filter)}]`)
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
							topPlayers += leaderboardPosition + ` **${user.username}** ─ ${typ.titleCase(filter)}: ${res[i].level} ─ Exp: ${res[i].totalExp}\n`
						} else {
							topPlayers += leaderboardPosition + `  **${user.username}** ─ ${typ.titleCase(filter)}: ${res[i].points}\n`
						}
					}
					messageEmbed.setDescription(topPlayers)
					message.say(messageEmbed)
				} catch(err) {
					console.error(err)
				}
			}
			getUser()
		})
	}
}