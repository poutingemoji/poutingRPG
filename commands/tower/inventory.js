const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const userStat = require('../../models/userstat')
const fs = require('fs')
const { SlowBuffer } = require('buffer')
const json = JSON.parse(fs.readFileSync('items.json', 'utf8'))
require('dotenv').config()

module.exports = class InventoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inventory',
            aliases: ['inv'],
            group: 'tower',
            memberName: 'inventory',
            description: 'View your inventory.',
            examples: [`${process.env.PREFIX}inventory [page]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'page',
                    prompt: 'What page would you like to see?',
                    type: 'integer',
                    default: 1,
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
    }

    run(message, { page }) {
        const itemsPerPage = 4
        userStat.findOne({
			userID: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
            const items = Array.from(currentUserstat.inventory.keys())
            const pageLimit = Math.ceil(items.length/itemsPerPage)
            
            if (!(page >= 1 && page <= pageLimit)) {
                let pluralize = `there are only **${pageLimit}** pages.`
                if (pageLimit == 1) pluralize = `there is only **1** page.`
                return message.say(`${emoji(message, "729190277511905301")} Page **${page}** doesn't exist, ` + pluralize)
            }

            const current = items.slice((page-1)*itemsPerPage, page*itemsPerPage)
            console.log(current)

            let description = ''
            let i = 0
            current.forEach(itemID => {
                i++
                description += `${json[itemID].name} ─ ${currentUserstat.inventory.get(itemID)}\n`
                description += 'ID: `' + itemID + '`\n'
                description += (i > 0 && i < itemsPerPage) ? '\n' : ''
                console.log(i)
            })
            const messageEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(description)
                .setFooter(`Owned Items ─ Page ${page} of ${pageLimit}`)
            message.say(messageEmbed) 
        
			currentUserstat.save().catch(err => console.log(err))
		})
    }
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}
