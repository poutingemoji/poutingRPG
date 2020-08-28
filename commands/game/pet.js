const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const enumHelper = require('../../utils/enumHelper')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
const Objects = require('../../database/Objects');
require('dotenv').config()

const positions = require('../../docs/data/positions.js')
const pets = require('../../docs/data/pets.js');
const { all } = require('bluebird');

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
    var player = await Database.findPlayer(message)
    const needs = enumHelper.needs
    const pet = player.pet
    if (!pets[pet.id]) await Database.createNewPet(message.author.id, Math.floor(Math.random()*pets.length), 'Yuhhhhh🚫🧢🥞')
    const secondsPassed = (new Date() - pet.updatedAt)/1000
    console.log(secondsPassed + ' seconds have passed')
    var difference = []
    for (var i = 0; i < needs.length; i++) {
      difference.push(-(secondsPassed/pets[pet.id].empty[needs[i]])*100)
    }
    const messageEmbed = new MessageEmbed()
    .setTitle(`${message.member.nickname || message.author.username}'s ${pets[pet.id].name}\n(${pet.nickname})`)
    .setThumbnail(pets[pet.id].image)

    player = await Database.updatePetNeeds(message.author.id, difference)
    const moodDict = {
      hunger: ['Starving', 'Hungry', 'Fine'],
      hygiene: ['Stinky', 'Dirty', 'Clean'],
      fun: ['Dreary', 'Bored', 'Glad'],
      energy: ['Exhausted', 'Tired', 'Energized']
    }
    const needColors = {
      hunger: {
        positive: '#d3d3d3',
        negative: '#fe532e',
      },
      hygiene: {
        positive: '#6ee4f4',
        negative: '#ce961f',
      },
      fun: {
        positive: '#2fd352',
        negative: '#e77dec',
      },
      energy: {
        positive: '#ffb3b3',
        negative: '#000000',
      },
    }
    var mood
    var roundedNeeds = []
    for (var i = 0; i < needs.length; i++) {
      var need = needs[i]
      console.log(player.pet[need])
      var roundedNeed = Math.round(player.pet[need])
      roundedNeeds.push(roundedNeed)
      messageEmbed.addField(`${Helper.titleCase(need)} (${roundedNeed}%)`, `[${progressBar(roundedNeed/100)}](https://www.youtube.com/user/pokimane)\n${player.pet[need] !== 0 ? `\`${Helper.secondsToDhms((player.pet[need]/100)*pets[player.pet.id].empty[need], ' and ', true, 2)} until empty\`` : ''}`, true)
      if (roundedNeed < 46) {
        mood = moodDict[need][1]
        messageEmbed.setColor(needColors[need].negative)
      }
      if (roundedNeed < 16) {
        mood = moodDict[needs[i]][0]
        messageEmbed.setColor(needColors[need].negative)
      }
    }
    
    if (roundedNeeds.every(need => need < 80 && need >= 46)) {
      mood = 'Fine'
      messageEmbed.setColor(needColors.hunger.negative)
      var highestNeed = needs[roundedNeeds.findIndex(need => need == Math.max.apply(null, roundedNeeds))]
      mood = moodDict[highestNeed][2]
      messageEmbed.setColor(needColors[highestNeed].positive)
    }
    if (roundedNeeds.every(need => need >= 80)) {
      messageEmbed.setColor('#208ff3')
      mood = 'Great'
    }

    messageEmbed.addFields(
      { name: `Experience`, value: `[${progressBar(pet.exp/pet.expMax)}](https://www.youtube.com/user/pokimane)\n\`Level ${pet.level} (${pet.exp}/${pet.expMax})\``, inline: true },
      { name: `Mood`, value: mood, inline: true }
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