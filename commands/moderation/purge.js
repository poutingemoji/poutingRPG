require('dotenv').config()
const { Command } = require('discord.js-commando')

const { emoji } = require('../../utils/Helper')

const minLimit = 1;
const maxLimit = 100;

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['prune', 'clear', 'wipe'],
      group: 'moderation',
      memberName: 'purge',
      description: 'Allows you to mass delete messages in your server.',
      examples: [
        `${client.commandPrefix}purge [#msgs]`,
      ],
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true,
      args: [
        {
          key: 'numOfMsgs',
          prompt: 'How many messages would you like to purge?',
          type: 'integer',
          validate: amt => {
            if (isNaN(amt)) return
            if (amt < minLimit) return `You need to purge at least ${minLimit} msg(s).`;
            if (amt > maxLimit) return `You can't purge more than ${maxLimit} msg(s)`;
            return true;
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
