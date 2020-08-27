const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Database = require('../../database/Database');
require('dotenv').config()

const weapons = require('../../docs/data/weapons.js')

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

  async run(message, { weapon }) {
    const player = await Database.findPlayer(message)

  }
}