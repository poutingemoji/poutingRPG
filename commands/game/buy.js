require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');

module.exports = class BuyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'buy',
      aliases: [],
      group: 'game',
      memberName: 'buy',
      description: 'Purchase a weapon from the weapons dealer.',
      examples: [`${process.env.PREFIX}buy [weapon]`],
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

  async run(msg, { weapon }) {
    const player = await Database.findPlayer(msg, msg.author)
    Database.addQuestsPlayer(msg.author)
    return msg.say('WIP')
  }
}