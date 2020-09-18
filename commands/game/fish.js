require('dotenv').config();
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

const { findPlayer, addExpPlayer, changeValuePlayer, addFishPlayer } = require('../../database/Database');
const { percentageChance } = require('../../utils/Helper');
const { currencies } = require('../../utils/enumHelper');

module.exports = class FishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fish',
			aliases: [],
			group: 'game',
			memberName: 'fish',
			description: 'Do your fishing.',
			examples: [
        `${client.commandPrefix}fish`,
        `${client.commandPrefix}fish stats`,
      ],
			clientPermissions: [],
			userPermissions: [],
      guildOnly: true,
			args: [
        {
          key: 'stats',
          prompt: "Would you like to see your fishing stats?",
          type: 'string',
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 3
      },
    })
	}
	
	async run(msg, {stats}) {
    const player = await findPlayer(msg, msg.author);
    const messageEmbed = new MessageEmbed()
    .setColor('#2f3136')

    let description = '';
    switch (stats) {
      case 'stats':
        messageEmbed.setTitle(`${msg.author.username}'s Fishing Statistics 🎣`)
        player.fishes.forEach((value, key) => {
          description += `${fishes[key].emoji} ${key}: **${value}**\n`
        })
        break;
      default:
        const fish = percentageChance(Object.keys(fishes), Object.values(fishes).map(res => res.rarity))
        description = `🎣 ${msg.author.username} fished out: **${fish} ${fishes[fish].emoji}** !\n\n`
        for (var i = 0; i < currencies.length; i++) {
          const cur = currencies[i]
          const exp = Math.ceil(fishes[fish][cur.name]/1.5)
          if (fishes[fish].hasOwnProperty(cur.name)) {
            description += `*You earned ${cur.name}:* **+ ${fishes[fish][cur.name]}** ${cur.emoji}\n`
            description += `*You earned experience:* **+ ${exp}** ✨`
            await changeValuePlayer(msg.author, cur.name, fishes[fish][cur.name])
            await addExpPlayer(msg.author, msg, exp)
            await addFishPlayer(msg.author, fish)
          }
        }
    }
    messageEmbed.setDescription(description)
    msg.say(messageEmbed)
	}
}

const fishes = {
  ['Shrimp']: {
    emoji: '🦐',
    points: 15,
    rarity: 60,
  },
  ['Fish']: {
    emoji: '🐟',
    points: 20,
    rarity: 50,
  },
  ['Tropical Fish']: {
    emoji: '🐠',
    points: 20,
    rarity: 40,
  },
  ['Blowfish']: {
    emoji: '🐡',
    points: 25,
    rarity: 35,
  },
  ['Squid']: {
    emoji: '🦑',
    points: 30,
    rarity: 30,
  },
  ['Octopus']: {
    emoji: '🐙',
    points: 30,
    rarity: 30,
  },
  ['Metalfish']: {
    emoji: '⚙️',
    points: 40,
    rarity: 20,
  },
  ['Silver Fish']: {
    emoji: '⛓️',
    points: 50,
    rarity: 15,
  },
  ['Crystal Shard']: {
    emoji: '💠',
    points: 90,
    rarity: 10,
  },
  ['Valuable Object']: {
    emoji: '🏺',
    points: 100,
    rarity: 5,
  },
  ['Baby Zygaena']: {
    emoji: '💮',
    points: 150,
    rarity: 1,
  },
  ['Sweetfish']: {
    emoji: '🦈',
    dallars: 5,
    rarity: 5,
  },
  ['Boot']: {
    emoji: '👢',
    points: 0,
    rarity: 3,
  },
  ['Brick']: {
    emoji: '🧱',
    points: 0,
    rarity: 3,
  },
  ['\nTotal Amount']: {
    emoji: '',
  },
}