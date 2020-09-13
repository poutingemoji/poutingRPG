require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { emoji } = require('../../utils/Helper')
const Requester = require('../../utils/Requester')

const dateFormat = require('dateformat')

module.exports = class UrbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: [],
			group: 'utility',
			memberName: 'urban',
      description: 'Look up a term on Urban Dictionary.',
      examples: [`${process.env.PREFIX}urban [term]`],
      clientPermissions: [],
      userPermissions: [],
      nsfw: true,
      args: [
        {
          key: 'term',
          prompt: "What term would you like to look up on Urban Dictionary?",
          type: 'string',
        },
      ],
      throttling: {
        usages: 1,
        duration: 10
      },
    })
  }
  async run(msg, {term}) {
    try {
      let urbanRequest = await Requester.request(`https://api.urbandictionary.com/v0/define?term=${term}`)
      const urbanList = urbanRequest["list"]
      const urbanInfo = urbanList[Math.floor(Math.random()*urbanList.length)]
      if (!urbanInfo) throw `${emoji(msg,'err')} Can't find the term, **${term}**, on Urban Dictionary.`
      const messageEmbed = new MessageEmbed()
        .setColor("#199ceb")
        .setTitle(urbanInfo["word"])
        .setURL(urbanInfo["permalink"])
        .setDescription(urbanInfo["definition"])
        .addField('Example', urbanInfo["example"])
        .setFooter(`by ${urbanInfo["author"]} • ${dateFormat(urbanInfo["written_on"], "mmmm dS, yyyy" )}`)
      msg.say(messageEmbed)
    } catch(err) {
      console.error(err)
      msg.say(err)
    }
  }
}