const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const fs = require('fs')
const typ = require('../../helpers/typ')
const lvl = require('../../helpers/lvl')
const User = require('../../objects/user')
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
			args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
	}

	async run(message) {
		function findUserstat() {
			return Userstat.findOne({
				userId: message.author.id,
			}).exec()
		}
		const USERSTAT = await findUserstat()
		if (USERSTAT) return

		const USER = new User(message.author.id)

		let { description, chooseOptions } = surnameDescription()
		const surnameFilter = response => {
			return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
		}
		message.say(description)

		message.channel.awaitMessages(surnameFilter, { max: 1, time: 60000 })
			.then(result => {
				let surnameOptions = surnameDescription().chooseOptions
				USER.surname = surnameOptions[parseInt(result.first().content)-1]

				let { description, chooseOptions } = raceDescription()
				const raceFilter = response => {
					return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
				}
				message.say(description)
				return message.channel.awaitMessages(raceFilter, { max: 1, time: 60000 })
			})
			.then(async result => {
				let raceOptions  = raceDescription().chooseOptions
				USER.race = raceOptions[result.first().content]

				let { description, chooseOptions } = positionDescription()
				const positionFilter = (reaction, user) => {
					return Object.keys(chooseOptions).includes(reaction.emoji.name) && user.id === message.author.id
				}
				const positions = Object.keys(chooseOptions)
				const positionMessage = await message.say(description)
				for (let i = 0; i < positions.length; i++) {
					await positionMessage.react(positions[i])
				}
				return positionMessage.awaitReactions(positionFilter, { max: 1, time: 60000 })
			})
			.then(async result => {
				let positionOptions  = positionDescription().chooseOptions
				USER.position = positionOptions[result.first().emoji.name]
				
				const UserstatSchema = new Userstat()
				const newUSERSTAT = Object.assign(UserstatSchema, USER)
				newUSERSTAT.save().catch(err => console.log(err))

				message.say(`${typ.emoji(message,"740795617726693435")} [**${showPosition(USER.position).toUpperCase()}**] ${message.author.username} **${showSurname(USER.surname)}** of the **${showRace(USER.race)}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(result => {
				console.log(result)
				message.say(typ.err(message, "You didn't answer in time. Your registration into the Tower is cancelled."))
			})
	}
}

//Show Userstats
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