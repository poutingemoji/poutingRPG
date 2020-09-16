require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, createNewPlayer } = require('../../database/Database');
const { titleCase } = require('../../utils/Helper')
const { emoji, confirmation } = require('../../utils/msgHelper')
const { embedColors } = require('../../utils/enumHelper')

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js')
const traits = [families, races, positions]

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'game',
			memberName: 'start',
			description: 'Begin your adventure up the Tower.',
      examples: [
        `${client.commandPrefix}start`,
        `${client.commandPrefix}start new`,
      ],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [
        {
          key: 'restart',
          prompt: "Would you like to create a new character?",
					type: 'string',
					oneOf: ['new'],
					default: false
        },
      ],
      throttling: {
        usages: 1,
        duration: 60
      },
    })
	}

	async run(msg, {restart}) {
    const player = await findPlayer(msg, msg.author, true)
    if (!restart && player) return 
    if (restart) {
      const res = await confirmation(msg, `${msg.author}, do you want to start over?`);
      if (!res) return;
    }

    const messageEmbed = new MessageEmbed()
      .setColor(embedColors.game)
  
    const choose = [chooseFamily, chooseRace, choosePosition]
    const traitsChosen = []
    for (var i = 0; i < traits.length; i++) {
      const { title, description, footer } = choose[i]()
      messageEmbed.setTitle(title)
      messageEmbed.setDescription(description)
      messageEmbed.setFooter(footer)
      const filter = res => {
        return Object.keys(Object.keys(traits[i])).map(n => `${parseInt(n)+1}`).includes(res.content) && res.author.id === msg.author.id
      }
      
      traitsChosen.push(
        await msg.say(messageEmbed).then(msgSent => {
          return msgSent.channel.awaitMessages(filter, { max: 1, time: 60000 })
            .then(res => {
              msgSent.delete()
              return Object.keys(traits[i])[res.first().content-1]
            }).catch(err => {
              return 
            }
        )}
      ))
      if (!traitsChosen[i]) return
    }

    msg.say(
      new MessageEmbed()
        .setColor(embedColors.game)
        .setDescription(`[**${positions[traitsChosen[2]].name.toUpperCase()}**] ${msg.author.username} **${families[traitsChosen[0]].name}** of the **${races[traitsChosen[1]].name}** race, I sincerely welcome you to the Tower.`)
    )
    if (msg.author.id !== '257641125135908866')  return msg.say(`Not accepting new entries right now, working on the storyline of this Tower of God RPG and I don't want any new data while I'm making it. Thank you for understanding and hope you look forward to the finished product! :)`)
    createNewPlayer(msg.author, traitsChosen[0], traitsChosen[1], traitsChosen[2])
	}
}










const chooseFamily = function() {
  var description = ''
  var i = 0
  for (var [key, value] of Object.entries(families)) {
    i++
    description += `${i} - **${value.name}** ${value.emoji}\n`
  }
  return { 
    title: 'Choose your family:', 
    description: description, 
    footer: 'Your family will determine some of the techniques you will be able to unlock.' 
  }
}

const chooseRace = function() {
  var description = ''
  var i = 0
  var categories = []
  for (var [key, value] of Object.entries(races)) {
    i++
    if (!categories.includes(value.category)) {
      categories.push(value.category)
      description += `**${titleCase(value.category)}**\n`
    }
    description += `${i} - ${value.name} ${value.emoji}\n`
  }
  return { 
    title: 'Choose your race:', 
    description: description, 
    footer: 'Your race will affect your stats.' 
  }
}

const choosePosition = function() {
  var description = ''
  var i = 0
  for (var [key, value] of Object.entries(positions)) {
    if (!(value.category == 'basic')) break;
    i++
    description += `${i} - **${value.name}** ${value.emoji}\n`
  }
  return { 
    title: 'Choose your position:', 
    description: description, 
    footer: 'Your position will determine some of the techniques you will be able to unlock and affect your stats.' 
  }
}