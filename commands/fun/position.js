const Discord = require('discord.js');
const fs = require('fs');
const { positionColors } = require('../../config.json');

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://poutingemoji:ILive4God@cluster0-gm8vk.mongodb.net/user-stats', {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
const userStat = require('../../models/userstat')

module.exports = {
	name: 'position',
	description: 'tower of god rank and position randomizer',
	aliases: [],
	cooldown: 1,
	usage: '[command name]',
	args: false,
	guildOnly: true,
	execute(message) {
		const positions = {
			[0] : {
				Name: "Fisherman",
				Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017703581024346/Main_position_7.png",
				Color: "#a2716b",
			},
			[1] : {
				Name: "Scout",
				Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017470788763659/Main_position_6.png",
				Color: "#92b096",
			},
			[2] : {
				Name: "Spear Bearer",
				Image: "https://cdn.discordapp.com/attachments/722720878932262952/723017114872578098/Main_position_3.png",
				Color: "#604f41",
			},
			[3] : {
				Name: "Light Bearer",
				Image: "https://cdn.discordapp.com/attachments/722720878932262952/723016426264461393/unknown.png",
				Color: "#baa564",
			},
			[4] : {
				Name: "Wave Controller",
				Image: "https://cdn.discordapp.com/attachments/722720878932262952/723016677834489906/Main_position_2.png",
				Color: "#748394",
			}
		}
		const positionIndex = Math.floor(Math.random() * Object.keys(positions).length)
		const position = positions[positionIndex]
		const ranks = ['A', 'B', 'C', 'D', 'E', 'F']
		const rankIndex = Math.floor(Math.random() * 30) + 1  
		const rankLetter = ranks[Math.ceil(rankIndex/5) - 1]
		let rankNumber = rankIndex % 5
		if (rankNumber == 0) {
			rankNumber = 5
		}
		const isIrregular = Math.random() >= 0.95
		let description 
		if (isIrregular) {
			description = `You will bring great change and chaos to the tower, ${rankLetter}-Rank ${rankNumber} ${position.Name}.`
		} else {
			description = `You are ${rankLetter}-Rank ${rankNumber} ${position.Name}.`
		}
		const positionEmbed = new Discord.MessageEmbed()
		.setColor(positionColors[position.Name])
        .setDescription(description)
        .setImage(position.Image)
		message.channel.send(positionEmbed)
		userStat.findOne({
			userID: message.author.id,
		}, (err, currentUserstat) => {
			if (err) console.log(err);
			currentUserstat.position = position.Name
			currentUserstat.irregular = isIrregular
			currentUserstat.rank = rankIndex
			currentUserstat.save().catch(err => console.log(err))
		})
	}
};