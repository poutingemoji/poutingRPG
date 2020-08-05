const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const fs = require('fs')
require('dotenv').config()

const ITEMSJSON = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

module.exports = class BuyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'buy',
            aliases: [],
            group: 'tower',
            memberName: 'buy',
            description: 'Purchase a weapon from the weapons dealer.',
            examples: [`${process.env.PREFIX}buy [weapon]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'weapon',
                    prompt: 'What weapon would you like to purchase?',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
    }

	hasPermission(message) {
        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
			if (!currentUserstat) {
				message.say(`${emoji(message, "729190277511905301")} **${message.author.username}**, you haven't been registered into the Tower. Use \`${message.client.commandPrefix}start\` to begin your climb.`)
				return false
			}
			return true
        })
	}

    run(message, { weapon }) {
        let itemID = ''
        let itemPrice = 0
        let itemDesc = ''

        for (let i in ITEMSJSON) { 
            if (weapon === i) { 
                itemID = i
                itemPrice = ITEMSJSON[i].price
                itemDesc = ITEMSJSON[i].desc
            }
        }

        itemPrice = 0

        if (itemID === '') {
            return message.say(`Weapons Dealer: I don't have **${weapon}**.`)
        }

        console.log(itemID)

        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
            console.log(currentUserstat.points)
            if (currentUserstat.points <= itemPrice) return message.say(`Weapons Dealer: You don't have enough money for **${ITEMSJSON[weapon].name}**.`)

            console.log(currentUserstat.inventory.get(itemID))

            
            if (!(currentUserstat.inventory.get(itemID))) {
                currentUserstat.inventory.set(itemID, 1)
            } else {
                currentUserstat.inventory.set(itemID, currentUserstat.inventory.get(itemID) + 1)
            }
            
            console.log(currentUserstat.inventory.get(itemID))

            currentUserstat.points = currentUserstat.points - itemPrice
            message.channel.send(`Weapons Dealer: **${ITEMSJSON[weapon].name}** is yours.`)
			currentUserstat.save().catch(err => console.log(err))
		})
    }
}