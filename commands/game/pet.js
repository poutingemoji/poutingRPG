require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Objects = require('../../database/Objects');
const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const enumHelper = require('../../utils/enumHelper');

const positions = require('../../docs/data/positions.js')
const pets = require('../../docs/data/pets.js');

const needs = enumHelper.petNeeds

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
          key: 'actionChosen',
          prompt: "What would you like to do to your pet?",
					type: 'string',
          oneOf: Object.keys(enumHelper.petActions).concat(['name', 'disown', 'new']),
          default: false
        },
        {
          key: 'nickname',
          prompt: 'What would you like to call your pet?',
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

	async run(message, { actionChosen, nickname }) {
    var player = await Database.findPlayer(message, message.author)
    var pet = player.pet
    if (!pets[pet.id] || actionChosen == 'new') {
      await Database.createNewPet(message.author.id, Math.floor(Math.random()*pets.length), '')
      return message.say('New pet has been created. Please run the command again.')
    }
    
    var differences = []
    if (Object.keys(enumHelper.petActions).includes(actionChosen)) {
      const actionIndex = Object.keys(enumHelper.petActions).findIndex(action => action == actionChosen)
      const needIncrease = Helper.clamp((pet[needs[actionIndex]] + 20), 0, 100) - pet[needs[actionIndex]]
      if (needIncrease == 0) return message.say(`Your ${needs[actionIndex]} is maxed. Please wait for it to go down.`)
      message.say(`You ${actionChosen} your pet.`)
      differences[actionIndex] = 20
      await Database.updatePetNeeds(message.author.id, differences)
      await Database.addExpPet(message.author.id, Math.round(needIncrease), 0, 100)
    }

    if (actionChosen == 'name') {
      if (nickname.length > 32 || !nickname) return message.say('Please keep your nickname at 32 characters or under.')
      await Database.renamePet(message.author.id, nickname)
      message.say(`Your pet's name is now **${nickname}**.`)
    }

    if (actionChosen == 'disown') {
      await Database.removePet(message.author.id)
      message.say(`You have disowned your **${pets[pet.id].name}(${pet.nickname})**.`)
    }

    if (!actionChosen) {
      const secondsPassed = (Date.now() - pet.updatedAt)/1000
      console.log(secondsPassed)
      for (var i = 0; i < needs.length; i++) {
        const difference = -(secondsPassed/pets[pet.id].empty[needs[i]])*100
        differences.push(difference)
        pet[needs[i]] += difference
      }

      await Database.updatePetNeeds(message.author.id, differences)
      console.log([pet.hunger, pet.hygiene, pet.fun, pet.energy])
      const messageEmbed = new MessageEmbed()
      .setTitle(`${message.member.nickname || message.author.username}'s ${pets[pet.id].name} ${pets[pet.id].emoji}\n${pet.nickname !== '' ? `(${pet.nickname})` : ''}`)
      .setThumbnail(pets[pet.id].image)

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