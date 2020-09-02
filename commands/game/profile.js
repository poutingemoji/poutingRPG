require('dotenv').config()
const { Command } = require("discord.js-commando")
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const enumHelper = require('../../utils/enumHelper');

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js')
const pets = require('../../docs/data/pets.js')

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: "profile",
			aliases: [],
			group: "game",
			memberName: "profile",
			description: "Displays your profile.",
			examples: [`${process.env.PREFIX}profile [@user/id]`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: `Who's profile would you like to see?`,
					type: 'user',
					default: false,
        },
      ],
			throttling: {
				usages: 1,
				duration: 5
			},
    })
    
	}
	
	async run(message, {user}) {
    user = user || message.author
    const player = await Database.findPlayer(message, user)
    const [family, race, position] = [families[player.family], races[player.race], positions[player.position]]
    console.log(family.name, race.name, position.name)
    const profile = [
      {
        [`${family.emoji} Family`]: family.name,
        [`${race.emoji} Race`]: race.name,
        [`${position.emoji} Position`]: position.name,
      },
      {
        ['⛩️ Level']: player.level,
        ['✨ Exp']: `${player.exp}/${player.expMax}`,
      },
      {
        ['💗 Health']: player.health,
        ['🌊 Shinsu']: player.shinsu,
      },
      {
        ['💯 Points']: player.points,
        ['🟠 Dallars']: player.dallars,
      },
      {
        ['🗺️ Arc']: player.arc,
        ['📖 Chapter']: player.chapter,
        ['🥋 Technique']: player.chapter,
      },
      {
        ['⛩️ Reputation']: player.reputation,
      },
    ]
    if (pets[player.pet.id]) profile[4]['📖 Pet'] = `${pets[player.pet.id].name}${player.pet.nickname !== '' ? ` (${player.pet.nickname})`: ''}`
    var profileMessage = ''
    profile.forEach(category => {
      profileMessage += `─────────────\n`
      for (var key in category) {
        profileMessage += `${key}: **${category[key]}**\n`
      }
    })
    const messageEmbed = new MessageEmbed()
    .setColor(enumHelper.positionColors[player.position])
    .setTitle(`${user.username}'s Profile`)
    .setThumbnail('https://cdn.discordapp.com/attachments/722720878932262952/750441484435849236/247.png')
    .setDescription(profileMessage)
    message.say(messageEmbed)
  }
}