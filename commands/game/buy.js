const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const playerSchema = require('../../database/schemas/player.js')
require('dotenv').config()

const weapons = require('../../docs/data/weapons.js')

module.exports = class BuyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'buy',
      aliases: [],
      group: 'game',
      memberName: 'buy',
      description: 'Purchase a weapon from the weapons dealer.',
      examples: [`${process.env.PREFIX}buy [weapon]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'weapon',
          prompt: 'What weapon would you like to purchase?',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })

  }

  run(message, { weapon }) {
    let itemID = ''
    let itemPrice = 0
    let itemDesc = ''

    for (let i in weapons) { 
      if (weapon === i) { 
        itemID = i
        itemPrice = weapons[i].price
        itemDesc = weapons[i].desc
      }
    }

    itemPrice = 0

    if (itemID === '') {
      return message.say(`Weapons Dealer: I don't have **${weapon}**.`)
    }

    console.log(itemID)

    playerSchema.findOne({
			playerId: message.author.id,
		}, (err, player) => {
      if (err) console.log(err)
      console.log(player.points)
      if (player.points <= itemPrice) return message.say(`Weapons Dealer: You don't have enough money for **${items[weapon].name}**.`)

      console.log(player.inventory.get(itemID))

      
      if (!(player.inventory.get(itemID))) {
        player.inventory.set(itemID, 1)
      } else {
        player.inventory.set(itemID, player.inventory.get(itemID) + 1)
      }
      
      console.log(player.inventory.get(itemID))

      player.points = player.points - itemPrice
      message.channel.send(`Weapons Dealer: **${items[weapon].name}** is yours.`)
			player.save().catch(err => console.log(err))
		})
  }
}