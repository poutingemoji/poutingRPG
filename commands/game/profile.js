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
const arcs = require('../../docs/data/arcs.js')

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
    const [family, race, pet, technique, arc] = [families[player.family], races[player.race], pets[player.pet.id], techniques[player.technique.id], arcs[player.volume][player.arc]]
    console.log(technique.name)
    const profile = [
      {
        [`${family.emoji} Family`]: family.name,
        [`${race.emoji} Race`]: race.name,
      },
      {

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
        ['🗺️ Arc']: arc.name,
        ['📖 Chapter']: player.chapter+1,
        ['🥋 Technique']: `${technique.name} (${Helper.romanize(player.technique.mastery)})`,
      },
      {
        ['🏔️ Reputation']: player.reputation,
      },
    ]
    if (player.position.length > 1) {
      var i = 0;
      player.position.forEach(res => { 
        i++
        profile[1][`${positions[res].emoji} Position ${i}`] = positions[res].name
      })
    } else {
      profile[1][`${positions[player.position[0]].emoji} Position`] = positions[player.position[0]].name
    }
    pets[player.pet.id] ? profile[5][`${pet.emoji} Pet`] = `${pet.name}` : profile[5]['❓ Pet'] = 'None';
    var profileMessage = ''
    profile.forEach(category => {
      profileMessage += `──────────────\n`
      for (var key in category) {
        profileMessage += `${key}: **${category[key]}**\n`
      }
    })
    const messageEmbed = new MessageEmbed()
    .setColor(enumHelper.positionColors[player.position[0]])
    .setTitle(`${user.username}'s Profile`)
    .setThumbnail(arc.image)
    .setDescription(profileMessage)
    .setFooter(`Born: ${dateFormat(player._id.getTimestamp(), "dddd, mmmm dS, yyyy, h:MM TT")}`);
    message.say(messageEmbed)
  }
}