const { Command } = require('discord.js-commando')
const Helper = require('../../utils/Helper')
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
        message.say(Helper.emojiMsg(message, "left", ["result"], `my owner is **poutingemoji#5785**.`, true))
    }
}
