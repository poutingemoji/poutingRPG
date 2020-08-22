const { Command } = require('discord.js-commando')
const Database = require('../../database/Database.js');
const Helper = require('../../utils/Helper')

require('dotenv').config()

const sdata = require('../../data/surnames.js')
const rdata = require('../../data/races.js')
const pdata = require('../../data/positions.js')

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'tower',
			memberName: 'start',
			description: 'Begin your adventure up the tower.',
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

    this.Database = new Database(Helper)
	}

	async run(message, {restart}) {
		var player = await this.Database.findPlayer(message.author.id)
		if (player && !restart) return
		
		let surname
		let race
		let position

		const confirmMsg = "I want to create a new character, I will lose all current progress"
		if (restart) {
			message.say(Helper.emojiMsg(message, "left", ["prompt1", "prompt2"], `Type the message below to **confirm**. ${Helper.mlcb(confirmMsg, "css")}`))
			const confirmFilter = response => {
				return confirmMsg.toLowerCase() == response.content.toLowerCase() && response.author.id === message.author.id
			}
			const confirmed = await message.channel.awaitMessages(confirmFilter, { max: 1, time: 60000 })
		}

		let description = surnameDescription()
		const surnameFilter = response => {
			return Object.keys(sdata).includes(response.content) && response.author.id === message.author.id
		}
		var createCharMsg = await message.say(description)

		message.channel.awaitMessages(surnameFilter, { max: 1, time: 60000 })
			.then(res => {
				surname = res.first().content

				let description = raceDescription()
				const raceFilter = response => {
					return Object.keys(rdata).includes(response.content) && response.author.id === message.author.id
        }
        console.log(rdata)
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

        console.log(surname, race, position)
				this.Database.createNewPlayer(message.author.id, surname, race, position)

				createCharMsg.reactions.removeAll()
				createCharMsg.edit(`${Helper.emoji(message,"740795617726693435")} [**${pdata[position].name.toUpperCase()}**] ${message.author.username} **${sdata[surname].name}** of the **${rdata[race].name}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(res => {
				console.log(res)
				message.say(Helper.emojiMsg(message, "left", ["err"], "You didn't answer in time. Your registration into the Tower is cancelled."))
			})
	}
}

//Descriptions
function surnameDescription() {
	const surnames = Object.keys(sdata)
	let description = 'Choose your surname:\n'
	for (let i = 0; i < surnames.length; i++) {
		description += `${i} - **${sdata[i].name}**\n`
	}
	return description
}

function raceDescription() {
	let description = 'Choose your race:\n'
  let categories = []
  for (var i = 0; i < rdata.length; i++) {
    if (!categories.includes(rdata[i].type)) {
      categories.push(rdata[i].type)
      description += `**${Helper.titleCase(rdata[i].type)}**\n`
    }
    description += `${i} - ${rdata[i].name}\n`
  }
	return description
}

function positionDescription() {
	const positions = Object.keys(pdata)
	let chooseOptions = {}
	let description = 'Choose your position:\n'
	let i = 0
	for (let i = 0; i < positions.length; i++) {
		description += `${pdata[i].emoji} - **${pdata[i].name}**\n`
		chooseOptions[pdata[i].emoji] = i
	}
	return {description, chooseOptions}
}