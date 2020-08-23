const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
require('dotenv').config()

const pdata = require('../../data/positions.js')

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
	
	async run(message, filter) {
    const checkDict = {
			['level'] : 'totalExp',
			['points'] : 'points',
    }
    filter = filter["filter"]
    const res = await Database.loadTop10([[checkDict[filter], 'descending']])
    
    async function getUser() {
      try {
        let leaderboardMaxUsers = res.length 
        let topPlayers = ''
        for (let i = 0; i < leaderboardMaxUsers; i++) {
          let leaderboardPosition
          const medals = ['🥇','🥈','🥉']
          if (i < 3) {
            leaderboardPosition = medals[i]
          } else {
            leaderboardPosition = i + 1
          }
          
          const user = await message.client.users.fetch(res[i].playerId)
          if (filter === 'level') {
            topPlayers += leaderboardPosition + `  [${pdata[res[i].position].name.substring(0,2)}]  **${user.username}** ─ ${Helper.titleCase(filter)}: ${res[i].level} ─ Exp: ${res[i].exp}\n`
          } else {
            topPlayers += leaderboardPosition + `  [${pdata[res[i].position].name.substring(0,2)}]  **${user.username}** ─ ${Helper.titleCase(filter)}: ${res[i].points}\n`
          }
        }
        
        const messageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setTitle(`Global Leaderboard [${Helper.titleCase(filter)}]`)
        .setDescription(topPlayers)
        message.say(messageEmbed)
      } catch(err) {
        console.error(err)
      }
    }
    getUser()
  }
}