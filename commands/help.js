const { prefix, color } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	guildOnly: true,
	cooldown: 1,
	execute(message, args) {
		const data = []
		const { commands } = message.client

		if (!args.length) {
			const helpEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setAuthor('poutingbot Commands', 'https://cdn.discordapp.com/attachments/722720878932262952/722909293480902737/Tower-of-God-Anak_1.png')
			.setDescription(commands.map(command => command.name).join(', '))
			.setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/722909293480902737/Tower-of-God-Anak_1.png')
			.addFields(
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
				{ name: '**Commands**', value: `${prefix}help commands`, inline: true },
			)
			data.push(helpEmbed)
			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
					message.reply('Yo dawg, ')
			
			message.channel.send(data, { split: true })	
			});
		}
		
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		console.log(args)
		if (args == 'commands') {
			data.push("`" + prefix + command.name + "`")
			data.push(command.description)
			message.channel.send(data, { split: true })	
		}	
	},
};