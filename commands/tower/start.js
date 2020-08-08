const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Database = require('../../database/Database');
const fs = require('fs')
const typ = require('../../utils/typ')
const lvl = require('../../utils/lvl')

require('dotenv').config()

const sdata = JSON.parse(fs.readFileSync('./data/surnames.json', 'utf8'))
const rdata = JSON.parse(fs.readFileSync('./data/races.json', 'utf8'))
const pdata = JSON.parse(fs.readFileSync('./data/positions.json', 'utf8'))

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

    this.Database = new Database(client)
	}

	async run(message, {restart}) {
		var player = await this.Database.findPlayer(message.author.id)
		if (player && !restart) return
		
		let surname
		let race
		let position

		const confirmMsg = "I want to create a new character, I will lose all current progress"
		if (restart) {
			message.say(typ.emojiMsg(message, "left", ["prompt1", "prompt2"], `Type the message below to **confirm**. ${typ.mlcb(confirmMsg, "css")}`))
			const confirmFilter = response => {
				return confirmMsg.toLowerCase() == response.content.toLowerCase() && response.author.id === message.author.id
			}
			const confirmed = await message.channel.awaitMessages(confirmFilter, { max: 1, time: 60000 })
		}

		let { description, chooseOptions } = surnameDescription()
		const surnameFilter = response => {
			return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
		}
		var createCharMsg = await message.say(description)

		message.channel.awaitMessages(surnameFilter, { max: 1, time: 60000 })
			.then(result => {
				const surnameOptions = surnameDescription().chooseOptions
				surname = surnameOptions[parseInt(result.first().content)-1]

				let { description, chooseOptions } = raceDescription()
				const raceFilter = response => {
					return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
				}
				createCharMsg.edit(description)
				return message.channel.awaitMessages(raceFilter, { max: 1, time: 60000 })
			})
			.then(async result => {
				const raceOptions  = raceDescription().chooseOptions
				race = raceOptions[result.first().content]

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
			.then(async result => {
				const positionOptions  = positionDescription().chooseOptions
				position = positionOptions[result.first().emoji.name]
				console.log(positionOptions[result.first().emoji.name])

				this.Database.createNewPlayer(message.author.id, surname, race, position)

				createCharMsg.reactions.removeAll()
				createCharMsg.edit(`${typ.emoji(message,"740795617726693435")} [**${showPosition(position).toUpperCase()}**] ${message.author.username} **${showSurname(surname)}** of the **${showRace(race)}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(result => {
				console.log(result)
				message.say(typ.emojiMsg(message, "left", ["err"], "You didn't answer in time. Your registration into the Tower is cancelled."))
			})
	}
}

//Show User Info
function showSurname(surname) {
	return sdata[surname].name
}

function showRace(race) {
	for (let c in rdata) {
    if (rdata[c][race]) return rdata[c][race].name
	}
}

function showPosition(position) {
	return pdata[position].name
}
	
//Descriptions
function surnameDescription() {
	const surnames = Object.keys(sdata)
	let chooseOptions = {}
	let description = 'Choose your surname:\n'
	for (let i = 0; i < surnames.length; i++) {
		const index = i+1
		const surname = surnames[i]
		description += `${index} - **${sdata[surname].name}**\n`
		chooseOptions[index] = surname
	}
	return {description, chooseOptions}
}

function raceDescription() {
	let chooseOptions = {}
	let description = 'Choose your race:\n'
	let i = 0
	for (let c in rdata) {
		description += `**${typ.titleCase(c)}**\n`
		console.log()
		for (let r in rdata[c]) {
			i++
			description += `${i} - ${rdata[c][r].name}\n`
			chooseOptions[i] = r
		}
	}
	return {description, chooseOptions}
}

function positionDescription() {
	const positions = Object.keys(pdata)
	let chooseOptions = {}
	let description = 'Choose your position:\n'
	let i = 0
	for (let i = 0; i < positions.length; i++) {
		const index = pdata[positions[i]].emoji
		const position = positions[i]
		description += `${index} - **${pdata[position].name}**\n`
		chooseOptions[index] = position
	}
	return {description, chooseOptions}
}