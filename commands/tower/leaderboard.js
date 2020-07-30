const { Command } = require('discord.js-commando');
const userStat = require('../../models/userstat');
const { MessageEmbed } = require('discord.js');
module.exports = class LeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			aliases: ['top'],
			group: 'tower',
			memberName: 'leaderboard',
			description: 'Displays the top players.',
			examples: [],
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
        });
	};

	run(message, filter) {
		filter = filter['filter']
		const checkDict = {
			['level'] : 'totalExp',
			['points'] : 'points',
		}
		userStat.find()
		.sort([
			[checkDict[filter], 'descending']
		  ]).exec((err, res) => {
			if (err) console.log(err)

			let leaderboardMaxUsers = 10
			if (res.length < leaderboardMaxUsers) leaderboardMaxUsers = res.length 
			let topPlayers = []
			const messageEmbed = new MessageEmbed()
			messageEmbed.setTitle(`Global Leaderboard [${titleCase(filter)}]`)
			messageEmbed.setColor('#2f3136')
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
						const user = await message.client.users.fetch(res[i].userID)
						if (filter === 'level') {
							topPlayers.push(leaderboardPosition + ` **${user.username}** - ${titleCase(filter)}: ${res[i].level} - Exp: ${res[i].totalExp}`)
						} else {
							topPlayers.push(leaderboardPosition + `  **${user.username}** - ${titleCase(filter)}: ${res[i].points}`)
						}
					}
					messageEmbed.setDescription(topPlayers.join('\n'))
					message.say(messageEmbed)
				} catch(error) {
					console.log(error)
				}
			}
			getUser()
		})
	}
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}

function titleCase(str) {
    str = str.replace(/_/g, " ")
    var splitStr = str.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' ')
}