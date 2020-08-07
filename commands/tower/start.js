const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const UserSchema = require('../../models/userschema')
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
            args: [
                {
                    key: 'restart',
                    prompt: "New Character or Reset?",
					type: 'string',
					oneOf: ['new', 'reset'],
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
		function findUserstat() {
			return UserSchema.findOne({
				userId: message.author.id,
			}).exec()
		}
		var USER = await findUserstat()
		if (USER && !restart) return
		
		var newUSER = new User(message.author.id)
		function startOver() {
			UserSchema.findOne({
				userId: message.author.id,
			}, (err, USER) => {
				if (restart == "reset") {
					newUSER.surname = USER.surname
					newUSER.race = USER.race
					newUSER.position = USER.position
				}
				USER = Object.assign(USER, newUSER)
				USER.save().catch(err => console.log(err))
			})
		}
		const confirmMsgs = {
			"new": "I want to create a new character, I will lose all current progress",
			"reset": "I want to reset my stats, I will only keep my surname, race and position"
		}
		if (confirmMsgs[restart]) {
			message.say(typ.emojiMsg(message, ["prompt1", "prompt2"], `Type the message below to **confirm**. ${typ.mlcb(confirmMsgs[restart], "css")}`))
			const confirmFilter = response => {
				return confirmMsgs[restart].toLowerCase() == response.content.toLowerCase() && response.author.id === message.author.id
			}
			const confirmed = await message.channel.awaitMessages(confirmFilter, { max: 1, time: 60000 })
		}
		
		if (restart == "reset") return startOver()

		let { description, chooseOptions } = surnameDescription()
		const surnameFilter = response => {
			return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
		}
		var createCharMsg = await message.say(description)

		message.channel.awaitMessages(surnameFilter, { max: 1, time: 60000 })
			.then(result => {
				const surnameOptions = surnameDescription().chooseOptions
				newUSER.surname = surnameOptions[parseInt(result.first().content)-1]

				let { description, chooseOptions } = raceDescription()
				const raceFilter = response => {
					return Object.keys(chooseOptions).includes(response.content) && response.author.id === message.author.id
				}
				createCharMsg.edit(description)
				return message.channel.awaitMessages(raceFilter, { max: 1, time: 60000 })
			})
			.then(async result => {
				const raceOptions  = raceDescription().chooseOptions
				newUSER.race = raceOptions[result.first().content]

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
				newUSER.position = positionOptions[result.first().emoji.name]
				console.log(positionOptions[result.first().emoji.name])

				if (restart = "new") {
					startOver()
				} else {
					var USERSCHEMA = new UserSchema()
					var newUSERSCHEMA = Object.assign(USERSCHEMA, newUSER)
					newUSERSCHEMA.save().catch(err => console.log(err))
				}

				createCharMsg.reactions.removeAll()
				createCharMsg.edit(`${typ.emoji(message,"740795617726693435")} [**${showPosition(newUSER.position).toUpperCase()}**] ${message.author.username} **${showSurname(newUSER.surname)}** of the **${showRace(newUSER.race)}** race, I sincerely welcome you to the Tower.`)
			})
			.catch(result => {
				console.log(result)
				message.say(typ.emojiMsg(message, ["err"], "You didn't answer in time. Your registration into the Tower is cancelled."))
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