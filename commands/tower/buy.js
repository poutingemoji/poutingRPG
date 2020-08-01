const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const userStat = require('../../models/userstat')
const fs = require('fs')
const items = JSON.parse(fs.readFileSync('items.json', 'utf8'))
require('dotenv').config()

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

    run(message, { weapon }) {
        let itemName = ''
        let itemPrice = 0
        let itemDesc = ''

        for (let i in items) { 
            if (weapon.toLowerCase() === items[i].name.toLowerCase()) { 
                itemName = items[i].name
                itemPrice = items[i].price
                itemDesc = items[i].desc
            }
        }

        itemPrice = 0

        if (itemName === '') {
            return message.say(`Weapons Dealer: I don't have **${weapon}**.`)
        }

        userStat.findOne({
			userID: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
            if (currentUserstat.points <= itemPrice) return message.say(`Weapons Dealer: You don't have enough money for **${weapon}**.`)
            currentUserstat.points = currentUserstat.points - itemPrice
            message.channel.send(`Weapons Dealer: **${weapon}** is yours.`)
			currentUserstat.save().catch(err => console.log(err))
		})
    }
}