const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');
require('dotenv').config()

const pdata = require('../../data/positions.js')

module.exports = class petCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pet',
			aliases: [],
			group: 'game',
			memberName: 'pet',
			description: 'Displays your pet.',
			examples: [`${process.env.PREFIX}pet`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
	
	async run(message, filter) {
    await Database.addExp(message.author.id, 341)
    const messageEmbed = new MessageEmbed()
    .setColor('#2f3136')
    .setTitle(`poutingemoji's Crab (rave)`)
    .setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/747640273923866704/250.png')
    .addFields(
      { name: 'Hunger', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
      { name: 'Hygiene', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
      { name: 'Fun', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
      { name: 'Energy', value: '[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (0%)', inline: true },
      { name: 'Experience', value: `[■■□□□□□□□□](https://www.youtube.com/user/pokimane) (100/100) \`Level 1\``, inline: true },
      { name: 'Mood', value: 'Vibing', inline: true },
    )
    message.say(messageEmbed)


  }
}