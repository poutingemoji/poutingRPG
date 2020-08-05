const { Command } = require('discord.js-commando')
const hfuncs = require('../../functions/helper-functions')
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
                message.say(`${hfuncs.emoji(message,"729255616786464848")}${hfuncs.emoji(message,"729255637837414450")} Successfully kicked **${user.tag}**.`)
            })
            .catch(() => {
                message.say(`${hfuncs.emoji(message, "729190277511905301")} Unable to kick **${user.tag}**.`)
            }) 
    }
}
