const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class ReverseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reverse',
			aliases: ['rv'],
			group: 'fun',
			memberName: 'reverse',
            description: 'Reverses the sentence structure of your text.',
            examples: [`${prefix}reverse message your reverse will This`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'text',
                    prompt: 'What would you like to reverse?',
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
        text = text.split(/\s/).reverse().join(" ");
        message.delete();
        return message.say(`${message.client.emojis.cache.get("729206897818730567").toString()}**${message.author.username}** : ${text}`);
    };
};
