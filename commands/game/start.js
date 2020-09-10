require('dotenv').config()
const { Command } = require('discord.js-commando')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper')

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js').slice(0, 5)

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'game',
			memberName: 'start',
			description: 'Begin your adventure up the Tower.',
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
        duration: 60
      },
    })

	}

	async run(message, {restart}) {
    const player = await Database.findPlayer(message, message.author, true)
    if (!restart && player) return 
    
   
		let family, race, position

		const confirmMsg = "yes"
		if (restart) {
			message.say(Helper.emojiMsg(message, "left", ["prompt1", "prompt2"], `Type the message below to **confirm**. ${Helper.codeBlock(confirmMsg, "css")}`))
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

				let description = positionDescription()
				const positionFilter = response => {
          return Object.keys(positions).includes(response.content) && response.author.id === message.author.id
				}
        createCharMsg.edit(description)
				return message.channel.awaitMessages(positionFilter, { max: 1, time: 30000 })
			})
			.then(async res => {
				position = res.first().content

        console.log(family, race, position)
				Database.createNewPlayer(message.author, family, race, position)

				createCharMsg.edit(`[**${positions[position].name.toUpperCase()}**] ${message.author.username} **${families[family].name}** of the **${races[race].name}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(err => {
				console.error(err)
				message.say(Helper.emojiMsg(message, "left", ["err"], "You didn't answer in time. Your registration into the Tower is cancelled."))
			})
	}
}

//Descriptions
function familyDescription() {
	let description = 'Choose your family:\n'
	for (let i = 0; i < families.length; i++) {
		description += `${i} - **${families[i].name}** ${families[i].emoji}\n`
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
    description += `${i} - ${races[i].name} ${races[i].emoji}\n`
  }
	return description
}

function positionDescription() {
	let description = 'Choose your position:\n'
	for (let i = 0; i < positions.length; i++) {
		description += `${i} - **${positions[i].name}** ${positions[i].emoji}\n`
	}
	return description
}