require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer } = require('../../database/Database');

const { maxShinsu, moveAccuracy, moveDamage } = require('../../utils/enumHelper');

const moves = require('../../docs/data/moves.js')

module.exports = class ShinsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			aliases: [],
			group: 'game',
			memberName: 'stats',
			description: 'Additional commands relating to your stats.',
			examples: [],
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
	
	async run(msg) {
    const player = await findPlayer(msg, msg.author)
    const stats = [
      {
        ['🌧️ Baang (Capacity)']: player.baang,
        ['💦 Myun (Accuracy)']: player.myun,
        ['☄️ Soo (Damage)']: player.soo,
      },
      {
        ['👊 Physical (Damage)']: player.physical,
        ['🛡️ Durability (Health)']: player.durability,
        ['💨 Speed (Dodge)']: player.speed,
      },
    ]
   
    let statsMessage = ``
    stats.forEach(category => {
      statsMessage += `────────────\n`
      for (var key in category) {
        statsMessage += `${key}: **${category[key]}**\n`
      }
    })
    console.log(player.quality)
    const messageEmbed = new MessageEmbed()
      .setColor('#56acef')
      .setTitle(`${msg.author.username}'s Statistics`)
      .setDescription(statsMessage)
    msg.say(messageEmbed)
	}
}