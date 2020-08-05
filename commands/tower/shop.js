const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const hfuncs = require('../../functions/helper-functions')

const ITEMSJSON = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'))

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

    run(message) {
        let categories = []
        console.log(Object.keys(ITEMSJSON))
        const messageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle("Weapons Dealer")
            .setDescription('13 Month Series ─  🗓️\nIgnition ─  🔥\nCompression ─  🗜️\n\n')

        for (let c in ITEMSJSON) { 
            categories.push(category)
            let tempDesc = ''
            for (let i in ITEMSJSON[c]) { 
                const item = ITEMSJSON[c][i]
                if (categories[c] === ITEMSJSON[i].type) {
                    tempDesc += `${hfuncs.emoji(message, ITEMSJSON[i].emojiId)}**${ITEMSJSON[i].name}** ─ __${hfuncs.numberWithCommas(ITEMSJSON[i].price)} points__ ─ ${ITEMSJSON[i].month ? ' 🗓️' : ''}${ITEMSJSON[i].ignition ? ' 🔥': ''}${ITEMSJSON[i].compression ? ' 🗜️' : ''}\n${ITEMSJSON[i].description}\n`
                }
            }
            messageEmbed.addField(categories[c], tempDesc)
        }
        message.say(messageEmbed) 
    }
}