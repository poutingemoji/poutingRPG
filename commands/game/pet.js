const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const enumHelper = require('../../utils/enumHelper')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
const Objects = require('../../database/Objects');
require('dotenv').config()

const positions = require('../../docs/data/positions.js')
const pets = require('../../docs/data/pets.js');
const help = Object.keys(enumHelper.petActions).concat(['name', 'disown', 'shop']);

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
      args: [
        {
          key: 'action',
          prompt: "What would you like to do to your pet?",
					type: 'string',
          oneOf: help,
          default: false
        },
        {
          key: 'arg',
          prompt: ' ',
					type: 'string',
          default: false
        },
      ],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
  
  //console.log(Objects.newQuest('Collect', ['Blueberries', 15], {points: 10, exp: 200}))

	async run(message, { action, arg }) {
    const player = await Database.findPlayer(message)
    const needs = enumHelper.petNeeds

    if (!pets[pet.id]) await Database.createNewPet(message.author.id, Math.floor(Math.random()*pets.length), 'Yuhhhhh🚫🧢🥞')
    const pet = {
      id: player.pet.id,
      updatedAt: player.pet.updatedAt,
      nickname: player.pet.nickname,
      level: player.pet.level,
      exp: player.pet.exp,
      expMax: player.pet.expMax,
      hunger: player.pet.hunger,
      hygiene: player.pet.hygiene,
      fun: player.pet.fun,
      energy: player.pet.energy,
    }
    
    var differences = []
    if (Object.keys(enumHelper.petActions).includes(action)) {
      const actionIndex = {
        feed: 0,
        wash: 1,
        play: 2,
        pat: 3,
      }
      const needIncrease = Helper.clamp((pet[needs[actionIndex[action]]] + 20), 0, 100) - pet[needs[actionIndex[action]]]
      if (needIncrease == 0) return message.say('Your stat is maxed. Please wait for it to go down.')
      message.say(`You ${action} your pet.`)
      differences[actionIndex[action]] = 20
      await Database.updatePetNeeds(message.author.id, differences)
      await Database.addExpPet(message.author.id, Math.round(needIncrease), 0, 100)
    }

    if (action == 'shop') {
      if (!arg) arg = 1
      if (!(arg >= 1 && arg <= argLimit)) {
        return message.say(Helper.emojiMsg(message, "left", ["err"], `Page **${arg}** doesn't exist.`))
      }

      const itemsPerPage = 4
      const items = pets
      const argLimit = Math.ceil(items.length/itemsPerPage)
      const current = items.slice((arg-1)*itemsPerPage, arg*itemsPerPage)

      console.log(current)
      let description = ''

      const messageEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setFooter(`Pet Store ─ Page ${arg} of ${argLimit}`)

      let cost = 100
      current.forEach(item => {
        console.log(item)
        cost += 180
        function findPetId(pet) {
          return pet.name == item.name
        }
        description += `**${pets[pets.findIndex(findPetId)].name}**\n${cost} points\n`
      })
      messageEmbed.addField('Pet Store', description)
      message.say(messageEmbed) 
    } 

    if (action == 'name') {
      if (!arg) return
      if (arg.length > 32) return message.say('Please keep your nickname at 32 characters or under.')
      await Database.renamePet(message.author.id, arg)
      message.say(`Your pet's name is now **${arg}**.`)
    }

    if (action == 'disown') {
      await Database.removePet(message.author.id)
      message.say(`You have disowned your **${pets[pet.id].name}(${pet.nickname})**.`)
    }

    if (!action) {
      const secondsPassed = (new Date() - pet.updatedAt)/1000
      for (var i = 0; i < needs.length; i++) {
        var difference = -(secondsPassed/pets[pet.id].empty[needs[i]])*100
        differences.push(difference)
        pet[needs[i]] += difference
      }
      const messageEmbed = new MessageEmbed()
      .setTitle(`${message.member.nickname || message.author.username}'s ${pets[pet.id].name}\n(${pet.nickname})`)
      .setThumbnail(pets[pet.id].image)

      await Database.updatePetNeeds(message.author.id, differences)
      var mood
      var roundedNeeds = []
      for (var i = 0; i < needs.length; i++) {
        var need = needs[i]
        pet[need] = Helper.clamp(pet[need], 0, 100)
        var roundedNeed = Math.round(pet[need])
        roundedNeeds.push(roundedNeed)
        messageEmbed.addField(
          `${Helper.titleCase(need)
          } (${roundedNeed}%)`, 
          `[${progressBar(roundedNeed/100)}](https://www.youtube.com/user/pokimane)\n${
          pet[need] !== 0 ? `\`${Helper.secondsToDhms((pet[need]/100)*pets[pet.id].empty[need], ' and ', true, 2)
          } until empty\`` : ''}`, true
        )
      }
      messageEmbed.addFields(
        { name: `Experience`, value: `[${progressBar(pet.exp/pet.expMax)}](https://www.youtube.com/user/pokimane)\n\`Level ${pet.level} (${pet.exp}/${pet.expMax})\``, inline: true },
        { name: `Mood`, value: 'Great', inline: true }
      )
      message.say(messageEmbed);
    }
  }
}

function progressBar(value) {
  value = Math.round(Helper.clamp(value, 0, 1)*10)
  return `${'■'.repeat(value)}${'□'.repeat(10-value)}`;
}