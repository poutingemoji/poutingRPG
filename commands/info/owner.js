const { Command } = require('discord.js-commando')
require('dotenv').config()

module.exports = class OwnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'owner',
			aliases: [],
			group: 'info',
			memberName: 'owner',
            description: "Shows the owner of this bot.",
            examples: [`${process.env.PREFIX}owner`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [],
            throttling: {
                usages: 1,
                duration: 3
            },
        })
    }
    run(message) {
        message.say(`${message.client.emojis.cache.get("729209778898862171").toString()} **${message.author.username}**, the Boruto's dad to my Boruto is **poutingemoji#5785**. Nin!`)
    }
}
