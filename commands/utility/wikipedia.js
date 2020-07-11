const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class WikipediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikipedia',
			aliases: ['wiki'],
			group: 'utility',
			memberName: 'wikipedia',
            description: 'S',
            examples: [`${prefix}wikipedia [article]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'article',
                    prompt: "What would you like to search on Google?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    run(message, {article}) {
        article = article.replace(/ /g, "_")
        message.say(`https://en.wikipedia.org/wiki/${article}`)
    };
};