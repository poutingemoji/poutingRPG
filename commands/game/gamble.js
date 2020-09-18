require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, changeValuePlayer } = require('../../database/Database');
const { embedColors, positionColors } = require('../../utils/enumHelper');

const moves = require('../../docs/data/moves.js');
const positions = require('../../docs/data/positions');

const minLimit = 500;
const maxLimit = 9999;

module.exports = class GambleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gamble',
			aliases: [],
			group: 'game',
			memberName: 'gamble',
			description: 'Gamble your points away.',
			examples: [
        `${client.commandPrefix}gamble [points]`,
        `${client.commandPrefix}gamble all`,
      ],
			clientPermissions: [],
			userPermissions: [],
      guildOnly: true,
			args: [
        {
          key: 'points',
          prompt: "How much would you like to gamble?",
          type: 'string',
          validate: amt => {
            if (isNaN(amt) && amt !== 'all') return
            if (amt < minLimit) return `You need to gamble at least ${minLimit} points.`;
            if (amt > maxLimit) return `You can't gamble more than ${maxLimit}.`;
            return true;
          },
        },
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
	}
	
	async run(msg, { points }) {
    const player = await findPlayer(msg, msg.author)
    if (points == 'all') points = player.points
    console.log(points)
    if (points > player.points) return msg.say(`You don't have ${points} points.`)
    const roll1 = Math.floor(Math.random()*10)
    const roll2 = Math.floor(Math.random()*10)
    var pointsChange = Math.round(points * (((roll1 - roll2) * 10)/100))
    changeValuePlayer(msg.author, 'points', pointsChange)
  
    const messageEmbed = new MessageEmbed()
    .setTitle(`${msg.author.username}'s Gambling Game`)
    .addFields(
      { name: msg.author.username, value: `Rolled \`${roll1}\``, inline: true },
      { name: 'Khun Aguero Agnis', value: `Rolled \`${roll2}\``, inline: true },
    )

    var changeMsg
    switch(Math.sign(pointsChange)) {
      case 1: 
        messageEmbed.setColor(positionColors.scout)
        changeMsg = 'won'; break;
      case -1: 
        messageEmbed.setColor(positionColors.fisherman)
        changeMsg = 'lost'; break;
      default: 
        messageEmbed.setColor(embedColors.game)
        changeMsg = 'won/lost'
    }
    messageEmbed.setDescription(`You ${changeMsg} ${Math.abs(pointsChange)} points.\n\nYou now have ${player.points + pointsChange} points.`)
    msg.say(messageEmbed)
	}
}