const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix } = require("../../config.json");
const fetch = require("node-fetch")

module.exports = class UrbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: [],
			group: 'utility',
			memberName: 'urban',
            description: 'Search up a term on Urban Dictionary.',
            examples: [`${prefix}urban [query]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    prompt: "What term would you like to look up on Urban Dictionary?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {query}) {
        const urbanRequest = await fetchUrbanInfo(`https://api.urbandictionary.com/v0/define?term=${query}`)
        const urbanList = urbanRequest["list"]
        const urbanInfo = urbanList[Math.floor(Math.random()*urbanList.length)]
        console.log(urbanInfo)
        const urbanEmbed = new MessageEmbed()
            .setColor("#199ceb")
            .setAuthor("Urban Dictionary", "https://cdn.discordapp.com/attachments/722720878932262952/730659040996098194/246x0w.png")
            .setTitle(urbanInfo["word"])
            .setURL(urbanInfo["permalink"])
            .setDescription(urbanInfo["definition"])
            .addField('Example', urbanInfo["example"])
            .setFooter(`by ${urbanInfo["author"]} • ${dateFormat(urbanInfo["written_on"], "mmmm dS, yyyy" )}`)
        message.say(urbanEmbed)
    };
};

async function fetchUrbanInfo(URL) {
    const res = await fetch(URL)
    return await res.json();
}
 