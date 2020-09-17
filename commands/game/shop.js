require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const { numberWithCommas, paginate } = require('../../utils/Helper')
const { buildEmbeds, commandInfo } = require('../../utils/msgHelper')
const { links } = require('../../utils/enumHelper')

const pageLength = 4;

module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      aliases: [],
      group: 'game',
      memberName: 'shop',
      description: 'Displays what is for sale.',
      examples: [
        `${client.commandPrefix}shop pet`
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'category',
          prompt: 'What category of the shop would you like to see?',
          type: 'string',
          default: 'pet',
        },
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  async run(msg, { category }) {
    if (!['pet'].includes(category)) {
      return commandInfo(msg, this)
    }
    const res = require(`../../docs/data/${category}s.js`);
    
    const embeds = [];
    var { maxPage } = paginate(Object.keys(res), 1, pageLength)
    for (let page = 0; page < maxPage; page++) {
      var { items } = paginate(Object.keys(res), page+1, pageLength)
      let itemsOffered = ''
      for (let item = 0; item < items.length; item++) {
        const itemInfo = res[items[item]]
      
        switch(category) {
          default:
            itemsOffered += `${itemInfo.emoji} **${itemInfo.name}**\n${itemInfo.price} points\n\n`; break;
          case 'pet':
            itemsOffered += `${itemInfo.emoji} **${itemInfo.name}**\n*[id: ${items[item]}](${links.website})*\n${numberWithCommas(itemInfo.price)} points\n\n`; break;
        }
      }
      embeds.push(
        new MessageEmbed()
        .setTitle(`[Page ${page+1}/${maxPage}]`)
        .setDescription(itemsOffered)
      )
    }
    
    buildEmbeds(msg, embeds, `To purchase a pet: ${this.client.commandPrefix}buy pet [id]`)
  }
}