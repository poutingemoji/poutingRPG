const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
require('dotenv').config()

const pdata = require('../../docs/data/positions.js')
const petdata = require('../../docs/data/pets.js')

module.exports = class petCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pet',
			aliases: [],
			group: 'game',
			memberName: 'pet',
			description: 'Displays your pet.',
			examples: [`${process.env.PREFIX}pet`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
	
	async run(message, filter) {
    const itemsPerPage = 4
    var page = 1
    const items = petdata
    const pageLimit = Math.ceil(items.length/itemsPerPage)
    
    if (!(page >= 1 && page <= pageLimit)) {
      return message.say(Helper.emojiMsg(message, "left", ["err"], `Page **${page}** doesn't exist.`))
    }

    const current = items.slice((page-1)*itemsPerPage, page*itemsPerPage)

    let description = ''
    let counter = 0

    const messageEmbed = new MessageEmbed()
    .setColor('#2f3136')
    .setFooter(`Pet Store ─ Page ${page} of ${pageLimit}`)

    let cost = 100
    let options = {}
    for (var i = 0; i < current.length; i++) {
      cost += 180
      description += `**${petdata[i].name}**\n${cost} points\n`
    }
    console.log(options)
    messageEmbed.addField('Pet Store', description)
    message.say(messageEmbed) 
  
    // console.log(`./docs/images/pets/${petdata[i].name.replace(/ /g,"_")}.png`)
    //await Database.addExp(message.author.id, 341)
    return
    for (var i = 0; i < petdata.length; i++) {
      const messageEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setTitle(`poutingemoji's ${petdata[i].name} (rave)`)
      .setThumbnail([`./docs/images/pets/${petdata[i].name.replace(/ /g,"_")}.png`])
      .addFields(
        { name: 'Hunger', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
        { name: 'Hygiene', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
        { name: 'Fun', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
        { name: 'Energy', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
        { name: 'Experience', value: `[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (100/100) \`Level 1\``, inline: true },
        { name: 'Mood', value: 'Vibing', inline: true },
      )
      message.say(messageEmbed)
    }
  }
}