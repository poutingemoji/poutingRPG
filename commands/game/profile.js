require('dotenv').config()
const { Command } = require("discord.js-commando")
const { MessageEmbed } = require('discord.js')

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const enumHelper = require('../../utils/enumHelper');

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js')
const techniques = require('../../docs/data/techniques.js')
const pets = require('../../docs/data/pets.js')

const dateFormat = require('dateformat')

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
    const [family, race, position, pet, technique] = [families[player.family], races[player.race], positions[player.position], pets[player.pet.id], techniques[player.technique.id]]
    console.log()
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
        ['💗 Health']: `${player.health}/${enumHelper.maxHealth(player.level)}`,
        ['🌊 Shinsu']: `${player.shinsu}/${enumHelper.maxShinsu(player.level)}`,
      },
      {
        ['⛳ Points']: player.points,
        ['🟡 Dallars']: player.dallars,
      },
      {
        ['🗺️ Arc']: player.arc,
        ['📖 Chapter']: player.chapter,
        ['🥋 Technique']: `${technique.name} (${Helper.romanize(player.technique.mastery)})`,
      },
      {
        ['🏔️ Reputation']: player.reputation,
      },
    ]
    pets[player.pet.id] ? profile[4][`${pet.emoji} Pet`] = `${pet.name}` : profile[4]['❓ Pet'] = 'None';
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
    .setFooter(`Created: ${dateFormat(player._id.getTimestamp(), "dddd, mmmm dS, yyyy, h:MM TT")}`);
    message.say(messageEmbed)
  }
}