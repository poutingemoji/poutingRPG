require('dotenv').config()
const { Command } = require('discord.js-commando')

const { emoji } = require('../../utils/Helper')

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['prune', 'clear', 'wipe'],
      group: 'moderation',
      memberName: 'purge',
      description: 'Allows you to mass delete messages in your server.',
      examples: [
        `${client.commandPrefix}purge [number]`,
      ],
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true,
      args: [
        {
          key: 'numOfMsgs',
          prompt: 'How many messages would you like to purge?',
          type: 'integer',
          validate: num => {
            if (100 > num && num > 0) return true
            return "Number of messages deleted must be greater than 0 and less than 100."
          }
        },
      ],
      throttling: {
        usages: 1,
        duration: 10
      },
    })
  }
  run(msg, {numOfMsgs}) {
    numOfMsgs++
    msg.channel.bulkDelete(numOfMsgs, true).catch(err => {
      console.error(err)
    })
    try {
      msg.say(`Deletion of messages successful. Total messages deleted: ${numOfMsgs-1}`).then(msgSent => {
        setTimeout(function(){
          msgSent.delete()
        }, 2000)
      })
    } catch(err) {
      msg.say(`${emoji(msg,'err')} Unable to purge messages.`)
      console.error(err)
    }
  }
}
