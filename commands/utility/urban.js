const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const dateFormat = require('dateformat')
const fetch = require("node-fetch")
const hfuncs = require('../../functions/helper-functions')
require('dotenv').config()

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
            guildOnly: false,
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
    async run(message, {term}) {
        try {
            let urbanRequest = await fetch(`https://api.urbandictionary.com/v0/define?term=${term}`)
            urbanRequest = await urbanRequest.json()
            const urbanList = urbanRequest["list"]
            const urbanInfo = urbanList[Math.floor(Math.random()*urbanList.length)]
            if (!urbanInfo) throw `${hfuncs.emoji(message, "729190277511905301")} **${message.author.username}**, I can't find the term, **${term}**, on Urban Dictionary.`
            const messageEmbed = new MessageEmbed()
                .setColor("#199ceb")
                .setTitle(urbanInfo["word"])
                .setURL(urbanInfo["permalink"])
                .setDescription(urbanInfo["definition"])
                .addField('Example', urbanInfo["example"])
                .setFooter(`by ${urbanInfo["author"]} • ${dateFormat(urbanInfo["written_on"], "mmmm dS, yyyy" )}`)
            message.say(messageEmbed)
        } catch(error) {
            message.say(error)
        }
    }
}