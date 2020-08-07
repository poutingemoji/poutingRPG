const { Command } = require('discord.js-commando')
const typ = require('../../helpers/typ')
require('dotenv').config()

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: [],
			group: 'moderation',
			memberName: 'ban',
            description: 'Bans the specified user.',
            examples: [`${process.env.PREFIX}ban [@user/id]`],
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Who would you like to ban?',
                    type: 'user',
                },
                {
                    key: 'numOfDays',
                    prompt: 'How many days would you like this user to be banned?',
                    type: 'integer',
                    default: false,
                },
            ],
            throttling: {
                usages: 1,
                duration: 3
            },
        })
    }
    run(message, {user, numOfDays}) {
        message.guild.member(user)
            .ban({ days: numOfDays })
            .then(() => {
                let bannedMsg = `Successfully banned **${user.tag}**`
                bannedMsg += numOfDays ? ` for ${numOfDays} day(s).` : `.`
                message.say(typ.emojiMsg(message, ["result"], bannedMsg))
            })
            .catch(() => {
                message.say(typ.emojiMsg(message, ["err"], `Unable to ban **${user.tag}**.`))
            }) 
    }
}