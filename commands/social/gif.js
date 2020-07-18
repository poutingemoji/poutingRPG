const { Command } = require('discord.js-commando');
const { TENORKEY } = require("../../config.json");
const Tenor = require("tenorjs").client({
    "Key": TENORKEY,
    "Filter": "low", 
    "Locale": "en_US", 
    "MediaFilter": "basic",
    "DateFormat": "D/MM/YYYY - H:mm:ss A" 
});

module.exports = class GifCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gif',
			aliases: [],
			group: 'social',
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
                duration: 2
            },
        });
    };
    run(message, {gif}) { 
        Tenor.Search.Random("anime" + gif, "1").then(Results => {
            Results.forEach(Post => {
                    Post.title ? Post.title : "Untitled";
                    console.log(`Item ${Post.id} (Created: ${Post.created}) @ ${Post.url}`);
                    message.say(Post.url)
            });
        }).catch(console.error);
    };
};