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
    console.log(this.group.id)
    const player = await findPlayer(msg, msg.author)
    if (!pets[id]) return msg.say(`There is no pet with the id, ${id}.`)
    await createNewPet(msg.author, id)
    msg.say('Pet bought')
    return 
    await addQuestsPlayer(msg.author)
    console.log(arcs[0].chapters[0].quests)
   
    return msg.say('WIP')
  }
}