require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer, addQuestsPlayer, createNewPet } = require('../../database/Database');
const { confirmation } = require('../../utils/Helper');

const pets = require('../../docs/data/pets.js');

module.exports = class BuyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'buy',
      aliases: [],
      group: 'game',
      memberName: 'buy',
      description: 'Purchase an item from the shop.',
      examples: [`${client.commandPrefix}buy pet [id]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'category',
          prompt: 'What category of the shop would you like to see?',
          type: 'string',
        },
        {
          key: 'id',
          prompt: 'What is the id of the item you want to buy?',
          type: 'string',
        },
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  async run(msg, { category, id }) {
    const player = await findPlayer(msg, msg.author)
    
   
    console.log()
    return msg.say(await createNewPet(msg.author, id))
    await addQuestsPlayer(msg.author)
    console.log(arcs[0].chapters[0].quests)
   
    return msg.say('WIP')
  }
}