const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const typ = require('../../helpers/typ')
const int = require('../../helpers/int')

const idata = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

module.exports = class BuyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shop',
            aliases: ['dealer'],
            group: 'tower',
            memberName: 'shop',
            description: "Displays the weapons dealer's inventory.",
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

    run(message) {
        let categories = []
        console.log(Object.keys(idata))
        const messageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle("Weapons Dealer")
            .setDescription('13 Month Series ─  🗓️\nIgnition ─  🔥\nCompression ─  🗜️\n\n')

        for (let c in idata) { 
            categories.push(category)
            let tempDesc = ''
            for (let i in idata[c]) { 
                const item = idata[c][i]
                if (categories[c] === idata[i].type) {
                    tempDesc += `${typ.emoji(message, idata[i].emojiId)}**${idata[i].name}** ─ __${int.numberWithCommas(idata[i].price)} points__ ─ ${idata[i].month ? ' 🗓️' : ''}${idata[i].ignition ? ' 🔥': ''}${idata[i].compression ? ' 🗜️' : ''}\n${idata[i].description}\n`
                }
            }
            messageEmbed.addField(categories[c], tempDesc)
        }
        message.say(messageEmbed) 
    }
}