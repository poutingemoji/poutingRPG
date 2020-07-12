const { Command } = require('discord.js-commando');
const { TENORKEY } = require("../../config.json");
const Tenor = require("tenorjs").client({
    "Key": TENORKEY,
    "Filter": "medium", 
    "Locale": "en_US", 
    "MediaFilter": "basic",
    "DateFormat": "D/MM/YYYY - H:mm:ss A" 
});

module.exports = class PoutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gif',
			aliases: [],
			group: 'fun',
			memberName: 'gif',
            description: 'Displays a random gif based on the provided tag or category.',
            examples: [],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'gif',
                    prompt: "What kind of gif would you like to send?",
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 4
            },
        });
    };
    run(message, {gif}) { 
        Tenor.Search.Random("anime" + gif, "1").then(Results => {
            Results.forEach(Post => {
                  console.log(`Item ${Post.id} (Created: ${Post.created}) @ ${Post.url}`);
                  message.say(Post.url)
            });
        }).catch(console.error);
    };
};