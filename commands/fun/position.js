const Discord = require('discord.js');
module.exports = {
	name: 'position',
	description: 'just a tower of god rank and position randomizer',
	cooldown: 3,
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
		const ranks = ["an Irregular", "an A-rank", "a B-rank", "a C-rank", "a D-rank", "an E-rank", "a F-rank"]
		var positionIndex = Math.floor(Math.random() * Object.keys(positions).length)
		var position = positions[positionIndex]
		var rank = ranks[Math.floor(Math.random() * Object.keys(ranks).length)]
		const storyEmbed = new Discord.MessageEmbed()
        .setColor(position.Color)
        .setDescription(`You are ${rank} ${position.Name}.`)
        .setImage(position.Image)
		message.channel.send(storyEmbed)
	},
};