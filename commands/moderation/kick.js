require('dotenv').config()
const { Command } = require('discord.js-commando')

const { emoji } = require('../../utils/Helper')

module.exports = class KickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			aliases: [],
			group: 'moderation',
			memberName: 'kick',
      description: 'Kicks the specified user.',
      examples: [
        `${client.commandPrefix}kick [user]`,
      ],
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
  run(msg, {user}) {
    msg.guild.member(user)
      .kick()
      .then(() => {
        msg.say(`Successfully kicked **${user.tag}**.`)
      })
      .catch(() => {
        msg.say(`${emoji(msg,'err')} Unable to kick **${user.tag}**.`)
      }) 
  }
}
