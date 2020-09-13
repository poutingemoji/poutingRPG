require('dotenv').config()
const { Command } = require('discord.js-commando')

const { emoji } = require('../../utils/Helper')

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: [],
			group: 'moderation',
			memberName: 'ban',
      description: 'Bans the specified user.',
      examples: [`${process.env.PREFIX}ban [user]`],
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
  run(msg, {user, numOfDays}) {
    msg.guild.member(user)
      .ban({ days: numOfDays })
      .then(() => {
        msg.say(`Successfully banned **${user.tag}**${numOfDays ? ` for ${numOfDays} day(s)` : ''}.`)
      })
      .catch(() => {
        msg.say(`${emoji(msg,'err')} Unable to ban **${user.tag}**.`)
      }) 
  }
}