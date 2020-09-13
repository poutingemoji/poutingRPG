require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { loadTopPlayers } = require('../../database/Database');
const { commandInfo, paginate, titleCase } = require('../../utils/Helper')
const { embedColors } = require('../../utils/enumHelper')

const positions = require('../../docs/data/positions.js')
const { cross } = require('../../docs/data/emojis.js')

const Pagination = require('discord-paginationembed');

const pageLength = 10;
const filters = {
  [false] : {
    filter: {level: -1, exp: -1},
    where: 'level',
  },
  ['points'] : {
    filter: {points: -1},
    where: 'points',
  },
  ['fish'] : {
    filter: { 'fishes.\nTotal Amount': -1, 'fishes.\nTotal Amount': 0},
    where: 'fishes.\nTotal Amount',
    gte: 1,
  },
}

module.exports = class TopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'top',
			aliases: ['leaderboard'],
			group: 'game',
			memberName: 'top',
			description: 'Displays the top players.',
      examples: [
        `${client.commandPrefix}top`,
        `${client.commandPrefix}top points`,
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
    if (!filters[filter]) {
      const commands = this.client.registry.findCommands('top', false, msg);
      return commandInfo(msg, commands[0])
    }
    const res = await loadTopPlayers(filters[filter].filter, filters[filter].where, filters[filter].gte || 0)
    var yourPosition = false
    var yourPage
    console.log(res.length)
    const embeds = [];

    var { maxPage } = paginate(res, 1, pageLength)
    for (let page = 0; page < maxPage; page++) {
      var { items, maxPage } = paginate(res, page+1, pageLength)
      let topPlayers = ''
      for (let item = 0; item < items.length; item++) {
        const player = items[item]
        const user = await msg.client.users.fetch(player.playerId)

        let lbPosition = page*pageLength+item
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
            topPlayers += `Points: ${player.points}\n`
            break;
          case 'fish':
            topPlayers += `Total Fish: ${player.fishes.get('\nTotal Amount')}\n`           
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
      .setNavigationEmojis({
        back: '⬅️',
        delete: cross,
        forward: '➡️',
        jump: '🔢',
      })
      .setDisabledNavigationEmojis(['delete'])
      .setColor(embedColors.game)
      .setFooter(`Your position: ${yourPosition ?  `${yourPosition}/${res.length} [Page ${yourPage}]` : 'Unranked'}`)
    
    await Embeds.build();
  }
}