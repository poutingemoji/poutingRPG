const { Command } = require('discord.js-commando')
const Database = require('../../database/Database');
const Helper = require('../../utils/Helper')

require('dotenv').config()

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js')

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'game',
			memberName: 'start',
			description: 'Begin your adventure up the game.',
			examples: [],
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
        duration: 43200
      },
    })

	}

	async run(message, {restart}) {
    const player = await Database.findPlayer(message, true)
    if (!restart && player) return 
		
		let family
		let race
		let position

		const confirmMsg = "yes"
		if (restart) {
			message.say(Helper.emojiMsg(message, "left", ["prompt1", "prompt2"], `Type the message below to **confirm**. ${Helper.mlcb(confirmMsg, "css")}`))
			const confirmFilter = response => {
				return confirmMsg.toLowerCase() == response.content.toLowerCase() && response.author.id === message.author.id
			}
			const confirmed = await message.channel.awaitMessages(confirmFilter, { max: 1, time: 60000 })
		}

		let description = familyDescription()
		const familyFilter = response => {
      console.log(families)
			return Object.keys(families).includes(response.content) && response.author.id === message.author.id
		}
		var createCharMsg = await message.say(description)

		message.channel.awaitMessages(familyFilter, { max: 1, time: 60000 })
			.then(res => {
				family = res.first().content

				let description = raceDescription()
				const raceFilter = response => {
					return Object.keys(races).includes(response.content) && response.author.id === message.author.id
        }
        console.log(races)
				createCharMsg.edit(description)
				return message.channel.awaitMessages(raceFilter, { max: 1, time: 60000 })
			})
			.then(async res => {
				race = res.first().content

				let { description, chooseOptions } = positionDescription()
				const positionFilter = (reaction, user) => {
					return Object.keys(chooseOptions).includes(reaction.emoji.name) && user.id === message.author.id
				}
				const positions = Object.keys(chooseOptions)
				const positionMessage = await createCharMsg.edit(description)
				for (let i = 0; i < positions.length; i++) {
					await positionMessage.react(positions[i])
				}
				return positionMessage.awaitReactions(positionFilter, { max: 1, time: 60000 })
			})
			.then(async res => {
				position = positionDescription().chooseOptions[res.first().emoji.name]

        console.log(family, race, position)
				Database.createNewPlayer(message.author.id, family, race, position)

        createCharMsg.reactions.removeAll().catch(err => console.error(err));
				createCharMsg.edit(`[**${positions[position].name.toUpperCase()}**] ${message.author.username} **${families[family].name}** of the **${races[race].name}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(res => {
				console.log(res)
				message.say(Helper.emojiMsg(message, "left", ["err"], "You didn't answer in time. Your registration into the Tower is cancelled."))
			})
	}
}

//Descriptions
function familyDescription() {
	let description = 'Choose your family:\n'
	for (let i = 0; i < families.length; i++) {
		description += `${i} - **${families[i].name}**\n`
	}
	return description
}

function raceDescription() {
	let description = 'Choose your race:\n'
  let categories = []
  for (var i = 0; i < races.length; i++) {
    if (!categories.includes(races[i].type)) {
      categories.push(races[i].type)
      description += `**${Helper.titleCase(races[i].type)}**\n`
    }
    description += `${i} - ${races[i].name}\n`
  }
	return description
}

function positionDescription() {
	let chooseOptions = {}
	let description = 'Choose your position:\n'
	let i = 0
	for (let i = 0; i < positions.length; i++) {
		description += `${positions[i].emoji} - **${positions[i].name}**\n`
		chooseOptions[positions[i].emoji] = i
	}
	return {description, chooseOptions}
}