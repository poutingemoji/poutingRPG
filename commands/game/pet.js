const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
const Objects = require('../../database/Objects');
require('dotenv').config()

const positions = require('../../docs/data/positions.js')
const pets = require('../../docs/data/pets.js')

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
  
  //console.log(Objects.newQuest('Collect', ['Blueberries', 15], {points: 10, exp: 200}))

	async run(message, filter) {
    const player = await Database.findPlayer(message)
    await Database.createNewPet(message.author.id, 0, 'Yuhhhhh🚫🧢🥞')
    const pet = player.pet
    const secondsPassed = (Date.now() - pet.updatedAt)/1000
    var mood = [
      -(secondsPassed/pets[pet.id].empty['hunger']), 
      -(secondsPassed/pets[pet.id].empty['hygiene']), 
      -(secondsPassed/pets[pet.id].empty['fun']), 
      -(secondsPassed/pets[pet.id].empty['energy'])
    ]
    console.log(mood)
    await Database.updateMoodPet(message.author.id, mood)
    const messageEmbed = new MessageEmbed()
    .setColor('#10a8f3')
    .setTitle(`${message.member.nickname || message.author.username}'s ${pets[pet.id].name}\n(${pet.nickname})`)
    .setThumbnail(pets[pet.id].image)
    .addFields(
      { name: `Hunger (${Math.round(pet.hunger)}%)`, value: `[${progressBar(32/100)}](https://www.youtube.com/user/pokimane)\n\`15h and 59m\``, inline: true },
      { name: `Hygiene (${Math.round(pet.hygiene)}%)`, value: `[${progressBar(22/100)}](https://www.youtube.com/user/pokimane)\n\`15h and 59m\``, inline: true },
      { name: `Fun (${Math.round(pet.fun)}%)`, value: `[${progressBar(60/200)}](https://www.youtube.com/user/pokimane)\n\`15h and 59m\``, inline: true },
      { name: `Energy (${Math.round(pet.energy)}%)`, value: `[${progressBar(46/400)}](https://www.youtube.com/user/pokimane)\n\`15h and 59m\``, inline: true },
      { name: `Experience`, value: `[${progressBar(pet.exp/pet.expMax)}](https://www.youtube.com/user/pokimane)\n\`Level ${pet.level} (${pet.exp}/${pet.expMax})\``, inline: true },
      { name: `Mood`, value: 'Vibing', inline: true },
    )
    message.say(messageEmbed);

    /*
    const itemsPerPage = 4
    var page = 1
    const items = pets
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
      description += `**${pets[i].name}**\n${cost} points\n`
    }
    console.log(options)
    messageEmbed.addField('Pet Store', description)
    message.say(messageEmbed) 
  
    // console.log(`./docs/images/pets/${pets[i].name.replace(/ /g,"_")}.png`)
    //await Database.addExp(message.author.id, 341)
    return
    */
  }
}

function progressBar(value) {
  value = Math.round(Helper.clamp(value, 0, 1)*10)
  return `${'■'.repeat(value)}${'□'.repeat(10-value )}`;
}