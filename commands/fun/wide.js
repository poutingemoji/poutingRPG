const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class WideCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wide',
			aliases: [],
			group: 'fun',
			memberName: 'wide',
            description: 'Makes your text wider.',
            examples: [`${prefix}wide [text]`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to make wide?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message, {text}) {
        text = text.split("").join(" ");
        message.delete();
        message.say(`${message.client.emojis.cache.get("729206897818730567").toString()}**${message.author.username}** : ${text}`);
    };
};
