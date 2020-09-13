require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { loadTop10 } = require('../../database/Database');
const { paginate, titleCase } = require('../../utils/Helper')
const { embedColors } = require('../../utils/enumHelper')

const positions = require('../../docs/data/positions.js')

const Pagination = require('discord-paginationembed');

module.exports = class TopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top',
			aliases: ['leaderboard'],
			group: 'game',
			memberName: 'top',
			description: 'Displays the top players.',
      examples: [
        `${process.env.PREFIX}top`,
        `${process.env.PREFIX}top points`,
    ],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [
        {
          key: 'filter',
          prompt: "What would you like to filter the leaderboard by?",
          type: 'string',
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
	
	async run(msg, { filter }) {
    const filters = {
			[false] : {level: -1, exp: -1},
			['points'] : {points: -1},
    }
    const res = await loadTop10(filters[filter])
    var yourPosition = false
    var yourPage

    const embeds = [];

    var { maxPage } = paginate(res)
    for (let page = 0; page < maxPage; page++) {
      var { items, maxPage } = paginate(res, page+1)
      let topPlayers = ''
      for (let item = 0; item < items.length; item++) {
        const player = items[item]
        const user = await msg.client.users.fetch(player.playerId)

        let lbPosition = page*10+item
        if (player.playerId == msg.author.id) {
          yourPosition = lbPosition+1
          yourPage = page+1
        }
        
        const medals = ['🥇','🥈','🥉']
        if (medals[lbPosition]) {
          lbPosition = medals[lbPosition]
        } else {
          lbPosition = `${lbPosition+1})`
        }
        topPlayers += `${lbPosition}    ${positions[player.position[0]].emoji}  **${user.username}** ─ `
        
        switch(filter) {
          case 'points':
            topPlayers += `${titleCase(filter)}: ${player.points}\n`
            break;
          default:
            topPlayers += `Lvl: ${player.level} ─ Exp: ${player.exp}\n`
        }
      }
      embeds.push(
        new MessageEmbed()
        .setTitle(`[Page ${page+1}/${maxPage}]`)
        .setDescription(topPlayers)
        
      )
    }
    
    const Embeds = new Pagination.Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setClientAssets({ msg, prompt: '{{user}}, which page would you like to see?' })
      .setDisabledNavigationEmojis(['delete'])
      .setColor(embedColors.game)
      .setFooter(`Your position: ${yourPosition ?  `${yourPosition}/${res.length} [Page ${yourPage}]` : 'Undefined'}`)
    
    await Embeds.build();
  }
}