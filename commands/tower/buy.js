const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const userStat = require('../../models/userstat')
const fs = require('fs')
const json = JSON.parse(fs.readFileSync('items.json', 'utf8'))
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
        let itemID = ''
        let itemPrice = 0
        let itemDesc = ''

        for (let i in json) { 
            if (weapon === i) { 
                itemID = i
                itemPrice = json[i].price
                itemDesc = json[i].desc
            }
        }

        itemPrice = 0

        if (itemID === '') {
            return message.say(`Weapons Dealer: I don't have **${weapon}**.`)
        }

        console.log(itemID)

        userStat.findOne({
			userID: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
            if (currentUserstat.points <= itemPrice) return message.say(`Weapons Dealer: You don't have enough money for **${json[weapon].name}**.`)

            console.log(currentUserstat.inventory.get(itemID))

            
            if (!(currentUserstat.inventory.get(itemID))) {
                currentUserstat.inventory.set(itemID, 1)
            } else {
                currentUserstat.inventory.set(itemID, currentUserstat.inventory.get(itemID) + 1)
            }
            
            console.log(currentUserstat.inventory.get(itemID))

            currentUserstat.points = currentUserstat.points - itemPrice
            message.channel.send(`Weapons Dealer: **${json[weapon].name}** is yours.`)
			currentUserstat.save().catch(err => console.log(err))
		})
    }
}