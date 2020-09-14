require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, createNewPlayer } = require('../../database/Database');
const { titleCase } = require('../../utils/Helper')
const { emoji, confirmation } = require('../../utils/msgHelper')
const { embedColors } = require('../../utils/enumHelper')

const characteristics = [require('../../docs/data/families.js'), require('../../docs/data/races.js'), require('../../docs/data/positions.js').slice(0, 5)]
const families = characteristics[0]
const races = characteristics[1]
const positions = characteristics[2]

module.exports = class StartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'start',
			aliases: [],
			group: 'game',
			memberName: 'start',
			description: 'Begin your adventure up the Tower.',
      examples: [
        `${client.commandPrefix}start`,
        `${client.commandPrefix}start new`,
      ],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [
        {
          key: 'restart',
          prompt: "Would you like to create a new character?",
					type: 'string',
					oneOf: ['new'],
					default: false
        },
      ],
      throttling: {
        usages: 1,
        duration: 60
      },
    })
	}

	async run(msg, {restart}) {
    const player = await findPlayer(msg, msg.author, true)
    if (!restart && player) return 
    if (restart) {
      const res = await confirmation(msg, `${msg.author}, do you want to start over?`);
      if (!res) return;
    }

    const messageEmbed = new MessageEmbed()
      .setColor(embedColors.game)
  
    const chooseFamily = function() {
      messageEmbed.setTitle('Choose your family:')
      let description = ''
      for (let i = 0; i < families.length; i++) {
        description += `${i+1} - **${families[i].name}** ${families[i].emoji}\n`
      }
      messageEmbed.setDescription(description)
    }
    
    const chooseRace = function() {
      messageEmbed.setTitle('Choose your race:')
      let description = ''
      let categories = []
      for (var i = 0; i < races.length; i++) {
        if (!categories.includes(races[i].type)) {
          categories.push(races[i].type)
          description += `**${titleCase(races[i].type)}**\n`
        }
        description += `${i+1} - ${races[i].name} ${races[i].emoji}\n`
      }
      messageEmbed.setDescription(description)
    }
    
    const choosePosition = function() {
      messageEmbed.setTitle('Choose your position:')
      let description = ''
      for (let i = 0; i < positions.length; i++) {
        description += `${i+1} - **${positions[i].name}** ${positions[i].emoji}\n`
      }
      messageEmbed.setDescription(description)
    }

    const choose = [chooseFamily, chooseRace, choosePosition]
    const characteristicsChosen = []
    for (var i = 0; i < characteristics.length; i++) {
      let content = choose[i]()
      const filter = res => {
        console.log(res.content)
        return Object.keys(characteristics[i]).map(n => `${parseInt(n)+1}`).includes(res.content) && res.author.id === msg.author.id
      }
      
      characteristicsChosen.push(
        await msg.say(messageEmbed).then(msgSent => {
          return msgSent.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(res => {
            msgSent.delete()
            return res.first().content-1
          }
        )}
      ))
    }

    console.log(characteristicsChosen)
    const qualities = [families[characteristicsChosen[0]].quality, races[characteristicsChosen[1]].quality]
    const quality = []
    for (var a = 0; a < qualities.length; a++) {
      for (var b = 0; b < qualities[a].length; b++) {
        if (Math.random() >= 0.66) {
          quality.push(qualities[a][b]);
        }
      }
    }

    msg.say(`[**${positions[characteristicsChosen[2]].name.toUpperCase()}**] ${msg.author.username} **${families[characteristicsChosen[0]].name}** of the **${races[characteristicsChosen[1]].name}** race, I sincerely welcome you to the Tower.`)
    if (msg.author.id !== '257641125135908866')  return msg.say(`Not accepting new entries right now, working on the storyline of this Tower of God RPG and I don't want any new data while I'm making it. Thank you for understanding and hope you look forward to the finished product! :)`)
    createNewPlayer(msg.author, characteristicsChosen[0], characteristicsChosen[1], characteristicsChosen[2], quality)
	}
}

