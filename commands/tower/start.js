const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const fs = require('fs')
const hfuncs = require('../../functions/helper-functions')
require('dotenv').config()

const FAMILIESJSON = JSON.parse(fs.readFileSync('./data/families.json', 'utf8'))
const RACESJSON = JSON.parse(fs.readFileSync('./data/races.json', 'utf8'))
const POSITIONSJSON = JSON.parse(fs.readFileSync('./data/positions.json', 'utf8'))

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'tower',
			memberName: 'start',
			description: 'Begin your adventure up the tower. What will you discover?',
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
		Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
			if (err) console.log(err)
			if (currentUserstat) return
			const families = Object.keys(FAMILIESJSON)
			
			function surnameDescription() {
				let description = 'Choose your surname:\n'
				for (let i = 0; i < families.length; i++) {
					description += `${i+1} - **${FAMILIESJSON[families[i]].name}**\n`
				}
				return description
			}

			function raceDescription() {
				let options = {}
				let i = 0
				let description = 'Choose your race:\n'
				for (let c in RACESJSON) {
					description += `**${hfuncs.titleCase(c)}**\n`
					for (let r in RACESJSON[c]) {
						i++
						options[i] = r
						description += `${i} - ${RACESJSON[c][r].name}\n`
					}
				}
				return {description, options}
			}

			function positionDescription(positions, emojiToPosition) {
				let description = 'Choose your position:\n'
				let i = 0
				Object.keys(POSITIONSJSON).map(position => {
					const emoji = POSITIONSJSON[position].emoji
					description += `${emoji} - **${POSITIONSJSON[emojiToPosition[emoji]].name}**\n`
					i++
				})
				return description
			}

			let emojiToPosition

			let newUser = {
				surname: "",
				race: "",
				position: "",
			}

			const surnameFilter = response => {
				return parseInt(response.content) > 0 && parseInt(response.content) <= families.length && response.author.id === message.author.id
			}
			message.say(surnameDescription())
			message.channel.awaitMessages(surnameFilter, { max: 1, time: 60000 })
				.then(result => {
					console.log(families[parseInt(result.first().content)-1])
					newUser.surname = families[parseInt(result.first().content)-1]
					let { description, options } = raceDescription()
					const raceFilter = response => {
						return Object.keys(options).includes(response.content) && response.author.id === message.author.id
					}
					message.say(description)
					return message.channel.awaitMessages(raceFilter, { max: 1, time: 60000 })
				})
				.then(async result => {
					let { options } = raceDescription()
					console.log(options[result.first().content])
					newUser.race = options[result.first().content]
					const positions = []
					emojiToPosition = {}
					Object.keys(POSITIONSJSON).map(position => {
						const emoji = POSITIONSJSON[position].emoji
						positions.push(emoji)
						emojiToPosition[POSITIONSJSON[position].emoji] = position
					})
					
					const positionFilter = (reaction, user) => {
						return positions.includes(reaction.emoji.name) && user.id === message.author.id
					}
					const sentMessage = await message.say(positionDescription(positions, emojiToPosition))
					for (let i = 0; i < positions.length; i++) {
						await sentMessage.react(positions[i])
					}
					return sentMessage.awaitReactions(positionFilter, { max: 1, time: 60000 })
				})
				.then(result => {
					newUser.position = emojiToPosition[result.first().emoji.name]
					const userstat = new Userstat({
						userId: message.author.id,
						exp: 0,
						level: 1,
						points: 10000,
						surname: newUser.surname,
						race: newUser.race,
						position: newUser.position,
						irregular: false,
						rank: 30,
						inventory: {},
					})
					userstat.save().catch(err => console.log(err))
				})
				.catch(result => {
					console.log(result)
					message.say(`${hfuncs.emoji(message,"729204396726026262")} **${message.author.username}**, you didn't answer in time. Your registration into the Tower is cancelled.`)
				})

		})

	}
}