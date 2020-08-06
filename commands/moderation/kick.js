const { Command } = require('discord.js-commando')
const typ = require('../../helpers/typ')
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
                message.say(`${typ.emoji(message,"729255616786464848")}${typ.emoji(message,"729255637837414450")} Successfully kicked **${user.tag}**.`)
            })
            .catch(() => {
                message.say(typ.err(message, `Unable to kick **${user.tag}**.`))
            }) 
    }
}
