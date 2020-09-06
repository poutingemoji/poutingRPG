require('dotenv').config();
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

const Database = require('../../database/Database');
const Helper = require('../../utils/Helper');
const enumHelper = require('../../utils/enumHelper');

const currencies = enumHelper.currencies

const fishes = {
  ['Silver Fish ⛓️']: {
    points: 20,
    rarity: 50,
  },
  ['Crystal Shard 💠']: {
    points: 45,
    rarity: 30,
  },
  ['Sweetfish 🦈']: {
    dallars: 5,
    rarity: 15,
  },
  ['Metalfish ⚙️']: {
    points: 60,
    rarity: 10,
  },
  ['Baby Zygaena 💮']: {
    points: 125,
    rarity: 5,
  },
}

module.exports = class FishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fish',
			aliases: [],
			group: 'game',
			memberName: 'fish',
			description: 'Do your fishing.',
			examples: [],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
			args: [],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
	}
	
	async run(message) {
    const player = await Database.findPlayer(message, message.author)
    const fish = Helper.percentageChance(Object.keys(fishes), Object.values(fishes).map(res => res.rarity))

    let description = `🎣 ${message.author.username} fished out: **${fish}** !\n\n`
    for (var i = 0; i < currencies.length; i++) {
      const cur = currencies[i]
      const exp = Math.ceil(fishes[fish][cur.name]/20)
      if (fishes[fish].hasOwnProperty(cur.name)) {
        description += `*You earned ${cur.name}:* **+ ${fishes[fish][cur.name]}** ${cur.emoji}\n`
        description += `*You earned experience:* **+ ${exp}** ✨`
        await Database.incrementValuePlayer(message.author.id, cur, fishes[fish][cur.name])
        await Database.addExpPlayer(message, message.author, exp)
      }
    }
    
    const messageEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setDescription(description)
    message.say(messageEmbed)
	}
}