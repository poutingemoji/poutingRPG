const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['copycat', 'repeat', 'echo', 'parrot'],
            group: 'fun',
            memberName: 'say',
            description: 'Replies with the text you provide.',
            examples: [`${prefix}say I have a voice? .3.`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like the bot to say?',
                    type: 'string'
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });    
    }

    run(message, { text }) {
        message.delete();
        return message.say(text);
    }
};