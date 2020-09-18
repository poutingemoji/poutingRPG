require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');

const Pagination = require('discord-paginationembed');

module.exports = class PagesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pages',
			aliases: [],
			group: 'game',
			memberName: 'pages',
			description: 'Page test.',
			examples: [
        `${client.commandPrefix}pages`,
      ],
			clientPermissions: [],
			userPermissions: [],
      guildOnly: true,
      hidden: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
	
	async run(msg) {
    const embeds = [];

    for (let i = 1; i <= 5; ++i)
      embeds.push(new MessageEmbed().setFooter(`Page ${i} of ${5}`));
    
    const Embeds = new Pagination.Embeds()
      .setArray(embeds)
      .setColor(0xFF00AE)
      .setTitle('Test Title')
      .setDescription('Test Description')
      
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setClientAssets({ msg, prompt: '{{user}}, which page would you like to see?' })
      .setDeleteOnTimeout(true)
    
    await Embeds.build();
  }
}