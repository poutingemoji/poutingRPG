require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, createNewPet, updateNeedsPet, addExpPet, renamePet, removePet } = require('../../database/Database');
const { clamp, titleCase, secondsToDhms, numberWithCommas, paginate } = require('../../utils/Helper');
const { commandInfo, buildEmbeds } = require('../../utils/msgHelper')
const { petNeeds, petActions, links } = require('../../utils/enumHelper');

const pets = require('../../docs/data/pets.js');

const oneOf = ['', 'feed', 'wash', 'play', 'pat', 'name', 'disown', 'list', 'buy']
const pageLength = 4;

module.exports = class petCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pet',
			aliases: [],
			group: 'game',
			memberName: 'pet',
			description: 'Displays your pet.',
      examples: [
        `${client.commandPrefix}pet`,
        `${client.commandPrefix}pet feed`,
        `${client.commandPrefix}pet wash`,
        `${client.commandPrefix}pet play`,
        `${client.commandPrefix}pet pat`,
        `${client.commandPrefix}pet name`,
        `${client.commandPrefix}pet disown`,
        `${client.commandPrefix}pet list`,
        `${client.commandPrefix}pet buy`,
      ],
			clientPermissions: [],
			userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'action',
          prompt: "What would you like to do to your pet?",
					type: 'string',
          default: '',
        },
        {
          key: 'idORnickname',
          prompt: '',
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
  
  //console.log(newQuest('Collect', ['Blueberries', 15], {points: 10, exp: 200}))
	async run(msg, { action, idORnickname }) {
    if (!oneOf.includes(action)) {
      return commandInfo(msg, this)
    }    
    var player = await findPlayer(msg, msg.author)
    var pet = player.pet
    if (!pets[pet.id]) {
      await createNewPet(msg.author, Object.keys(pets)[Math.floor(Math.random()*Object.keys(pets).length)], '')
      return msg.say(`To purchase a pet: ${this.client.commandPrefix}buy pet [id]`)
    }
    
    var differences = []
    if (Object.keys(petActions).includes(action)) {
      const actionIndex = Object.keys(petActions).findIndex(action => action == action)
      const needIncrease = clamp((pet[petNeeds[actionIndex]] + 42), 0, 100) - pet[petNeeds[actionIndex]]
      if (needIncrease == 0) return msg.say(`Your ${petNeeds[actionIndex]} is maxed. Please wait for it to go down.`)
      msg.say(`You ${action} your pet.`)
      differences[actionIndex] = 42
      await updateNeedsPet(msg.author, differences)
      await addExpPet(msg.author, Math.round(needIncrease), 0, 100)
    }

    switch (action) {
      case 'list':
        const embeds = [];
        var { maxPage } = paginate(Object.keys(pets), 1, pageLength)
        for (let page = 0; page < maxPage; page++) {
          var { items } = paginate(Object.keys(pets), page+1, pageLength)
          let itemsOffered = ''
          for (let item = 0; item < items.length; item++) {
            const itemInfo = pets[items[item]]
            itemsOffered += `${itemInfo.emoji} **${itemInfo.name}**\n*[id: ${items[item]}](${links.website})*\n${numberWithCommas(itemInfo.price)} points\n\n`
          }
          embeds.push(
            new MessageEmbed()
            .setTitle(`[Page ${page+1}/${maxPage}]`)
            .setDescription(itemsOffered)
          )
        }
        buildEmbeds(msg, embeds, `To purchase a pet: ${this.client.commandPrefix}pet buy [id]`)
        break;
      case 'buy':
        msg.say(await createNewPet(msg.author, idORnickname))
        break;
      case 'name':
        if (idORnickname.length > 32 || !idORnickname) return msg.say('Please keep your nickname at 32 characters or under.')
        await renamePet(msg.author, idORnickname)
        msg.say(`Your pet's name is now **${idORnickname}**.`)
        break;
      case 'disown':
        await removePet(msg.author)
        msg.say(`You have disowned ${pet.idORnickname ? pet.idORnickname : `your ${pets[pet.id].name} ${pets[pet.id].emoji}`}.`)
        break;
      default: 
        const secondsPassed = (Date.now() - pet.updatedAt)/1000
        console.log(secondsPassed)
        for (var i = 0; i < petNeeds.length; i++) {
          const difference = -(secondsPassed/pets[pet.id].empty[petNeeds[i]])*100
          differences.push(difference)
          pet[petNeeds[i]] += difference
        }

        await updateNeedsPet(msg.author, differences)
        console.log([pet.hunger, pet.hygiene, pet.fun, pet.energy])
        const messageEmbed = new MessageEmbed()
        .setTitle(`${msg.member.idORnickname || msg.author.username}'s ${pets[pet.id].name} ${pets[pet.id].emoji}\n${pet.idORnickname !== '' ? `(${pet.idORnickname})` : ''}`)
        .setThumbnail(pets[pet.id].image)

        var mood
        var roundedNeeds = []
        for (var i = 0; i < petNeeds.length; i++) {
          var need = petNeeds[i]
          pet[need] = clamp(pet[need], 0, 100)
          var roundedNeed = Math.round(pet[need])
          roundedNeeds.push(roundedNeed)
          messageEmbed.addField(
            `${titleCase(need)
            } (${roundedNeed}%)`, 
            `[${progressBar(roundedNeed/100)}](https://www.youtube.com/user/pokimane)\n${
            pet[need] !== 0 ? `\`${secondsToDhms((pet[need]/100)*pets[pet.id].empty[need], ' and ', true, 2)
            } until empty\`` : ''}`, true
          )
        }
        messageEmbed.addFields(
          { name: `Experience`, value: `[${progressBar(pet.exp/pet.expMax)}](https://www.youtube.com/user/pokimane)\n\`Level ${pet.level} (${pet.exp}/${pet.expMax})\``, inline: true },
          { name: `Mood`, value: 'Great', inline: true }
        )
        msg.say(messageEmbed);
    }
  }
}

function progressBar(value) {
  value = Math.round(clamp(value, 0, 1)*10)
  return `${'■'.repeat(value)}${'□'.repeat(10-value)}`;
}