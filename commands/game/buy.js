require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, addQuestsPlayer } = require('../../database/Database');
const { confirmation } = require('../../utils/Helper');

module.exports = class BuyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'buy',
      aliases: [],
      group: 'game',
      memberName: 'buy',
      description: 'Purchase an item from the shop.',
      examples: [`${client.commandPrefix}buy [category] [item]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  async run(msg, { category, item }) {
    const player = await findPlayer(msg, msg.author)
    console.log(player.dallars)
    return 
    await addQuestsPlayer(msg.author)
    console.log(arcs[0].chapters[0].quests)
   
    return msg.say('WIP')
  }
}