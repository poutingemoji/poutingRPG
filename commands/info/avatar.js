const { Command } = require('discord.js-commando')
require('dotenv').config()

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['icon', 'pfp'],
			group: 'info',
			memberName: 'avatar',
            description: "Links a URL to the avatar of the mentioned user.",
            examples: [`${process.env.PREFIX}avatar [@user/id]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: "Who's profile picture would you like to see?",
                    type: 'user',
                    default: false,
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
    }
    run(message, {user}) {
        const mentionedUser = user || message.author
		message.say(mentionedUser.displayAvatarURL())
    }
}