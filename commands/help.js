const testFolder = './tests/';
const fs = require('fs');
const { prefix, color } = require('../config.json');
const Discord = require('discord.js');



module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	cooldown: 1,
	execute(message, args) {
		const capitalize = (s) => {
			if (typeof s !== 'string') return ''
			return s.charAt(0).toUpperCase() + s.slice(1)
		  }
		const data = []
		if (!args.length && message.channel.type !== 'dm') {
			const helpEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setAuthor('poutingbot Commands', 'https://cdn.discordapp.com/attachments/722720878932262952/722909293480902737/Tower-of-God-Anak_1.png')
			.setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/722909293480902737/Tower-of-God-Anak_1.png')
			.addFields(
				{ name: '**Player Info**', value: `${prefix}help playerinfo`, inline: true },
				{ name: '**Moderation**', value: `${prefix}help moderation`, inline: true },
				{ name: '**Fun**', value: `${prefix}help fun`, inline: true },
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
			fs.readdir(`./commands/${helpCategory}`, (err, files) => {
				files.forEach(file => {
					const {name, description} = require(`../commands/${helpCategory}/${file.slice(0,-3)}`)
					data.push("`" + prefix + name + "`")
					data.push(description)
				})
				console.log(data)
				const helpEmbed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle(capitalize(helpCategory))
					.setDescription(data)
					.setThumbnail('https://cdn.discordapp.com/attachments/722168603620933714/723442881368555550/latest.png')
				message.author.send(helpEmbed)	
			})	
		}	
	},
};