require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const { emoji, titleCase } = require('../../utils/Helper')

module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      aliases: [],
      group: 'game',
      memberName: 'shop',
      description: 'Displays what is for sale.',
      examples: [`${client.commandPrefix}shop [category] [page]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'category',
          prompt: 'What category of the shop would you like to see?',
          type: 'string',
          oneOf: ['pet'],
        },
        {
          key: 'page',
          prompt: 'What page of the shop would you like to see?',
					type: 'integer',
          default: 1
        },
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  run(msg, { category, page }) {
    return msg.say('WIP')
    const categoryColors = {
      pet: '#ee2446'
    }
    const itemsPerPage = 4
    var categoryChosen = require(`../../docs/data/${category}s.js`);
    const argLimit = Math.ceil(categoryChosen.length/itemsPerPage)

    if (!(argLimit >= page && page >= 1)) {
      return msg.say(`${emoji(msg,'err')} Page ${page} doesn't exist.`)
    }

    const current = categoryChosen.slice((page-1)*itemsPerPage, page*itemsPerPage)
    const messageEmbed = new MessageEmbed()
    .setColor(categoryColors[category])
    .setFooter(`${titleCase(category)} Store ─ Page ${page} of ${argLimit}`)

    let description = ''

    current.forEach(itemCurrent => {
      console.log(itemCurrent)
      itemCurrent = categoryChosen[categoryChosen.findIndex(item => item.name == itemCurrent.name)]
      description += `${itemCurrent.emoji} **${itemCurrent.name}**\n${itemCurrent.price} points\n`
    })
    messageEmbed.addField(`${titleCase(category)} Store`, description)
    msg.say(messageEmbed) 
  }
}