require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const { titleCase } = require('../../utils/Helper')

const positions = require('../../docs/data/positions.js')

module.exports = class TopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top',
			aliases: ['leaderboard'],
			group: 'game',
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
	
	async run(msg, { filter }) {
    const checkDict = {
			['level'] : 'exp',
			['points'] : 'points',
    }
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
            leaderboardPosition = `${i + 1})`
          }
          
          const user = await msg.client.users.fetch(res[i].playerId)
          if (filter === 'level') {
            topPlayers += `${leaderboardPosition}    ${positions[res[i].position[0]].emoji}  **${user.username}** ─ ${titleCase(filter)}: ${res[i].level} ─ Exp: ${res[i].exp}\n`
          } else {
            topPlayers += `${leaderboardPosition}    ${positions[res[i].position[0]].emoji}  **${user.username}** ─ ${titleCase(filter)}: ${res[i].points}\n`
          }
        }
        
        const messageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setTitle(`Global Leaderboard [${titleCase(filter)}]`)
        .setDescription(topPlayers)
        msg.say(messageEmbed)
      } catch(err) {
        console.error(err)
      }
    }
    getUser()
  }
}