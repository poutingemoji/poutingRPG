require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const enumHelper = require('../../utils/enumHelper');

const techniques = require('../../docs/data/techniques.js')
const qualities = require('../../docs/data/qualities.js')

module.exports = class ShinsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shinsu',
			aliases: [],
			group: 'game',
			memberName: 'shinsu',
			description: 'Additional commands relating to your shinsu.',
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
	
	async run(message) {
    const player = await Database.findPlayer(message, message.author)
    const technique = techniques[player.technique.id]
    const shinsu = [
      {
        ['🌊 Shinsu']: `${player.shinsu}/${enumHelper.maxShinsu(player.level)}`,
        ['🎯 Accuracy']: `${Helper.clamp(Math.round(100-player.technique.id*.9), 0, 100)}%`,
        ['💥 Damage']: `${player.technique.id*4.5}`,
      },
      {

      },
      {
        ['🌧️ Baang']: player.baang,
        ['💦 Myun']: player.myun,
        ['☄️ Soo']: player.soo,
      },
    ]
    if (player.quality.length > 1) {
      var i = 0;
      player.quality.forEach(res => { 
        i++
        shinsu[1][`${qualities[res].emoji} Quality ${i}`] = qualities[res].name
      })
    } else if (player.quality.length == 1) {
      shinsu[1][`${qualities[player.quality[0]].emoji} Quality`] = qualities[player.quality[0]].name
    } else {
      shinsu[1]['❓ Quality'] = 'None';
    }
   
    let shinsuMessage = `${technique.name} ${technique.emoji}\n`
    shinsu.forEach(category => {
      shinsuMessage += `────────────\n`
      for (var key in category) {
        shinsuMessage += `${key}: **${category[key]}**\n`
      }
    })
    const messageEmbed = new MessageEmbed()
      .setColor('#56acef')
      .setTitle(`${message.author.username}'s Shinsu`)
      .setThumbnail(technique.image)
      .setDescription(shinsuMessage)
    message.say(messageEmbed)
	}
}