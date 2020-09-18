require('dotenv').config()
const { Command } = require('discord.js-commando')

const Helper = require('../../utils/Helper')

module.exports = class OwnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'owner',
			aliases: [],
			group: 'info',
			memberName: 'owner',
        description: "Shows the owner of this bot.",
        examples: [
          `${client.commandPrefix}owner`,
        ],
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
  run(msg) {
    console.log(msg.client.owner)
    msg.say(`${msg.author}, my owner is **poutingemoji#5785**.`)
  }
}
