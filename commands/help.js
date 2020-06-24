const testFolder = './tests/';
const fs = require('fs');
const { prefix, color } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: [],
	cooldown: 0,
	usage: '[command name]',
	args: false,
	guildOnly: false,
	execute(message, args) {
		const data = []
		if (!args.length && message.channel.type !== 'dm') {
			const helpEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setAuthor('poutingbot Commands', 'https://cdn.discordapp.com/attachments/722720878932262952/723594329477611600/Tower-of-God-Anak_1.png')
			.setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/723594329477611600/Tower-of-God-Anak_1.png')
			.addFields(
				{ name: 'Player Info', value: `${prefix}help playerinfo`, inline: true },
				{ name: 'Moderation', value: `${prefix}help moderation`, inline: true },
				{ name: 'Fun', value: `${prefix}help fun`, inline: true },
			)
			data.push(helpEmbed)
			return message.author.send(data, { split: true })
				.then(() => {
					message.react("✅")
					message.channel.send("I've dmed you dawg.")	
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
					message.reply("Yo dawg, I can't message you bruh.")
			});
		}
		var helpCategory = args.toString()
		if (['playerinfo','moderation', 'fun'].includes(helpCategory) && message.channel.type === 'dm') {
			fs.readdir(`./Commands/${helpCategory}`, (err, files) => {
				files.forEach(file => {
					const {name, description} = require(`../Commands/${helpCategory}/${file.slice(0,-3)}`)
					data.push("`" + prefix + name + "`")
					data.push(description)
				})
				console.log(data)
				if (helpCategory === 'playerinfo') {
					helpCategory = 'Player Info'
				} else if (helpCategory === 'moderation') {
					helpCategory = 'Moderation'
				} else if (helpCategory === 'fun') {
					helpCategory = 'Fun'
				}
				const helpEmbed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle(helpCategory)
					.setDescription(data)
					.setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/723594429314629702/latest.png')
				message.author.send(helpEmbed)	
			})	
		}	
	},
};