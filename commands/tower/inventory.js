const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const playerSchema = require('../../database/schemas/player')
const fs = require('fs')
const Helper = require('../../utils/Helper')
require('dotenv').config()

const items = require('../../data/items')

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      aliases: ['inv'],
      group: 'tower',
      memberName: 'inventory',
      description: 'View your inventory.',
      examples: [`${process.env.PREFIX}inventory [page]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'page',
          prompt: 'What page would you like to see?',
          type: 'integer',
          default: 1,
        }
      ],
      throttling: {
        usages: 1,
        duration: 5
      },

    })
  }

  run(message, { page }) {
    const itemsPerPage = 4
    playerSchema.findOne({
			discordId: message.author.id,
		}, (err, player) => {
      if (err) console.log(err)
      const items = Array.from(player.inventory.keys())
      const pageLimit = Math.ceil(items.length/itemsPerPage)
      
      if (!(page >= 1 && page <= pageLimit)) {
        return message.say(Helper.emojiMsg(message, "left", ["err"], `Page **${page}** doesn't exist.`))
      }

      const current = items.slice((page-1)*itemsPerPage, page*itemsPerPage)
      console.log(current)

      let description = ''
      let counter = 0
      current.forEach(itemId => {
        console.log(itemId)
        counter++
        description += `**${items[itemId].name}** ─ ${player.inventory.get(itemId)}\n`
        description += `ID \`${itemId}\` *${items[itemId].type}*\n`
        description += (counter > 0 && counter < itemsPerPage) ? '\n' : ''
      })
      const messageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(description)
        .setFooter(`Owned Items ─ Page ${page} of ${pageLimit}`)
      message.say(messageEmbed) 
    
			player.save().catch(err => console.log(err))
		})
  }
}