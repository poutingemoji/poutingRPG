const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const items = JSON.parse(fs.readFileSync('items.json', 'utf8'))

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
        console.log(Object.keys(items))
        for (const i in items) { 
            if (!categories.includes(items[i].type)) {
                categories.push(items[i].type)
            }
        }
        const messageEmbed = new MessageEmbed()
            .setTitle("Weapons Dealer")
            .setColor('#2f3136')
            .setDescription('13 Month Series ─  🗓️\nIgnition ─  🔥\nCompression ─  🗜️\n\n')

        for (let i = 0; i < categories.length; i++) { 
            let tempDesc = ''
            for (let c in items) { 
                if (categories[i] === items[c].type) {
                    tempDesc += `${emoji(message, items[c].emojiID)}**${items[c].name}** ─ __${numberWithCommas(items[c].price)} points__ ─ ${items[c].month ? ' 🗓️' : ''}${items[c].ignition ? ' 🔥': ''}${items[c].compression ? ' 🗜️' : ''}\n${items[c].description}\n`
                }
            }
            messageEmbed.addField(categories[i], tempDesc)
        }
        message.say(messageEmbed) 
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}