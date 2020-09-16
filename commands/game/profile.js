require('dotenv').config()
const { Command } = require("discord.js-commando")
const { MessageEmbed } = require('discord.js')

const { findPlayer } = require('../../database/Database');
const { romanize } = require('../../utils/Helper');
const { maxHealth, maxShinsu, positionColors } = require('../../utils/enumHelper');

const families = require('../../docs/data/families.js')
const races = require('../../docs/data/races.js')
const positions = require('../../docs/data/positions.js')
const moves = require('../../docs/data/moves.js')
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
			examples: [`${client.commandPrefix}profile [@user/id]`],
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
	
	async run(msg, {user}) {
    user = user || msg.author
    const player = await findPlayer(msg, user)
    const [family, race, pet, arc] = [families[player.family], races[player.race], pets[player.pet.id], arcs[player.arc]]
    const profile = [
      {
        [`${family.emoji} Family`]: family.name,
        [`${race.emoji} Race`]: race.name,
      },
      {
        [`${positions[player.position[0]].emoji} Positions`]: player.position.map(position => positions[position].name).join(', '),
      },
      {
        ['⛩️ Level']: player.level,
        ['✨ Exp']: `${player.exp}/${player.expMax}`,
      },
      {
        ['💗 Health']: `${player.health}/${maxHealth(player.level)}`,
        ['🌊 Shinsu']: `${player.shinsu}/${maxShinsu(player.level)}`,
      },
      {
        ['⛳ Points']: player.points,
        ['🟡 Dallars']: player.dallars,
      },
      {
        ['🗺️ Arc']: arc.name,
        ['📖 Chapter']: player.chapter+1,
        ['🥋 Techniques']: player.move.map(move => moves[move].name).join(', '),
        [`${pet ? pet.emoji : '❓'} Pet`]: pet ? pet.name : 'None',
      },
      {
        ['🏔️ Reputation']: player.reputation,
      },
    ]
    var profileMessage = ''
    profile.forEach(category => {
      profileMessage += `──────────────\n`
      for (var key in category) {
        profileMessage += `${key}: **${category[key]}**\n`
      }
    })
    const messageEmbed = new MessageEmbed()
    .setColor(positionColors[player.position[0]])
    .setTitle(`${user.username}'s Profile`)
    .setThumbnail(arc.image)
    .setDescription(profileMessage)
    .setFooter(`Born: ${dateFormat(player._id.getTimestamp(), "dddd, mmmm dS, yyyy, h:MM TT")}`);
    msg.say(messageEmbed)
  }
}