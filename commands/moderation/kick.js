const { Command } = require('discord.js-commando')
require('dotenv').config()

module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			aliases: [],
			group: 'moderation',
			memberName: 'kick',
            description: 'Kicks the specified user.',
            examples: [`${process.env.PREFIX}kick [@user/id]`],
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to kick?',
                    type: 'user',
                },
            ],
            throttling: {
                usages: 1,
                duration: 3
            },
        })
    }
    run(message, {user}) {
        message.guild.member(user)
            .kick()
            .then(() => {
                message.say(`${emoji(message,"729255616786464848")}${emoji(message,"729255637837414450")} Successfully kicked **${user.tag}**.`)
            })
            .catch(() => {
                message.say(`${emoji(message, "729190277511905301")} Unable to kick **${user.tag}**.`)
            }) 
    }
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}