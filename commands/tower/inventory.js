const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const fs = require('fs')
const typ = require('../../helpers/typ')
require('dotenv').config()

const idata = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

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
        Userstat.findOne({
			userId: message.author.id,
		}, (err, USERSTAT) => {
            if (err) console.log(err)
            const items = Array.from(USERSTAT.inventory.keys())
            const pageLimit = Math.ceil(items.length/itemsPerPage)
            
            if (!(page >= 1 && page <= pageLimit)) {
                return message.say(typ.emojiMsg(message, ["err"], `Page **${page}** doesn't exist.`))
            }

            const current = items.slice((page-1)*itemsPerPage, page*itemsPerPage)
            console.log(current)

            let description = ''
            let counter = 0
            current.forEach(itemId => {
                console.log(itemId)
                counter++
                description += `**${idata[itemId].name}** ─ ${USERSTAT.inventory.get(itemId)}\n`
                description += `ID \`${itemId}\` *${idata[itemId].type}*\n`
                description += (counter > 0 && counter < itemsPerPage) ? '\n' : ''
            })
            const messageEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(description)
                .setFooter(`Owned Items ─ Page ${page} of ${pageLimit}`)
            message.say(messageEmbed) 
        
			USERSTAT.save().catch(err => console.log(err))
		})
    }
}