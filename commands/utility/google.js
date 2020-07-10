const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: [],
			group: 'utility',
			memberName: 'google',
            description: 'Search using the Google Search Engine right from Discord.',
            examples: [`${prefix}google [search query]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'search',
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
    run(message, {query}) {
        query = query.replace(/ /g, "+")
        message.say(`https://www.google.fr/search?q=${query}`)
    };
};