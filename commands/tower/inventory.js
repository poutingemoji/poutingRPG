const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Userstat = require('../../models/userstat')
const fs = require('fs')
const hfuncs = require('../../functions/helper-functions')
require('dotenv').config()

const ITEMSJSON = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

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

	hasPermission(message) {
        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
			if (!currentUserstat) {
				message.say(`${hfuncs.emoji(message, "729190277511905301")} **${message.author.username}**, you haven't been registered into the Tower. Use \`${message.client.commandPrefix}start\` to begin your climb.`)
				return false
			}
			return true
        })
	}

    run(message, { page }) {
        const itemsPerPage = 4
        Userstat.findOne({
			userId: message.author.id,
		}, (err, currentUserstat) => {
            if (err) console.log(err)
            const items = Array.from(currentUserstat.inventory.keys())
            const pageLimit = Math.ceil(items.length/itemsPerPage)
            
            if (!(page >= 1 && page <= pageLimit)) {
                let pluralize = `there are only **${pageLimit}** pages.`
                if (pageLimit == 1) pluralize = `there is only **1** page.`
                return message.say(`${hfuncs.emoji(message, "729190277511905301")} Page **${page}** doesn't exist, ` + pluralize)
            }

            const current = items.slice((page-1)*itemsPerPage, page*itemsPerPage)
            console.log(current)

            let description = ''
            let counter = 0
            current.forEach(itemId => {
                console.log(itemId)
                counter++
                description += `**${ITEMSJSON[itemId].name}** ─ ${currentUserstat.inventory.get(itemId)}\n`
                description += `ID \`${itemId}\` *${ITEMSJSON[itemId].type}*\n`
                description += (counter > 0 && counter < itemsPerPage) ? '\n' : ''
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