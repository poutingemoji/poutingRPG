require('dotenv').config()
const { Command } = require('discord.js-commando')

const { updateAllPlayers } = require('../../database/Database');

module.exports = class UpdateAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'updateall',
      aliases: [],
      group: 'game',
      memberName: 'updateall',
      description: 'Update all MongoDB documents.',
      examples: [`${client.commandPrefix}updateall`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      hidden: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  run(msg) {
    if (msg.author.id !== '257641125135908866') return
    updateAllPlayers()
    return msg.say('Updated all MongoDB documents, master.')
    //const player = await findPlayer(msg, msg.author)
    //addQuestsPlayer(msg.author)
    //return msg.say('WIP')
  }
}