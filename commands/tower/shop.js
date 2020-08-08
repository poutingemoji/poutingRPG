const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const typ = require('../../utils/typ')
const int = require('../../utils/int')

const items = require('../../data/items.js')

module.exports = class BuyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      aliases: ['dealer'],
      group: 'tower',
      memberName: 'shop',
      description: "Displays the weapons dealer's inventory.",
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  run(message) {
    let categories = []
    console.log(Object.keys(items))
    const messageEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setTitle("Weapons Dealer")
      .setDescription('13 Month Series ─  🗓️\nIgnition ─  🔥\nCompression ─  🗜️\n\n')

    for (let c in items) { 
      categories.push(category)
      let tempDesc = ''
      for (let i in items[c]) { 
        const item = items[c][i]
        if (categories[c] === items[i].type) {
          tempDesc += `${typ.emoji(message, items[i].emojiId)}**${items[i].name}** ─ __${int.numberWithCommas(items[i].price)} points__ ─ ${items[i].month ? ' 🗓️' : ''}${items[i].ignition ? ' 🔥': ''}${items[i].compression ? ' 🗜️' : ''}\n${items[i].description}\n`
        }
      }
      messageEmbed.addField(categories[c], tempDesc)
    }
    message.say(messageEmbed) 
  }
}