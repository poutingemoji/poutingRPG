const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const UserSchema = require('../../models/userschema')
const fs = require('fs')
require('dotenv').config()

const idata = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

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

        for (let i in idata) { 
            if (weapon === i) { 
                itemID = i
                itemPrice = idata[i].price
                itemDesc = idata[i].desc
            }
        }

        itemPrice = 0

        if (itemID === '') {
            return message.say(`Weapons Dealer: I don't have **${weapon}**.`)
        }

        console.log(itemID)

        UserSchema.findOne({
			userId: message.author.id,
		}, (err, USER) => {
            if (err) console.log(err)
            console.log(USER.points)
            if (USER.points <= itemPrice) return message.say(`Weapons Dealer: You don't have enough money for **${idata[weapon].name}**.`)

            console.log(USER.inventory.get(itemID))

            
            if (!(USER.inventory.get(itemID))) {
                USER.inventory.set(itemID, 1)
            } else {
                USER.inventory.set(itemID, USER.inventory.get(itemID) + 1)
            }
            
            console.log(USER.inventory.get(itemID))

            USER.points = USER.points - itemPrice
            message.channel.send(`Weapons Dealer: **${idata[weapon].name}** is yours.`)
			USER.save().catch(err => console.log(err))
		})
    }
}