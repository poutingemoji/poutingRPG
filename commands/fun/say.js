const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");
const translate = require('@vitalets/google-translate-api');
const { e } = require('mathjs');

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
            guildOnly: true,
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
        console.log(text)
        const args = text.split(" ")
        message.delete();
        if (args[0].toLowerCase() === "chinese") {
            args[0] = "Chinese (Simplified)"
        }
        console.log(args)
        text = args.join(" ")
        if (translate.languages.getCode(args[0])) {
            let language = args[0];
            const opts = {
                to: translate.languages.getCode(language.toLowerCase()), 
            }
            translate(text.replace(args[0], ''), opts)
                .then(response => {
                    message.say(response.text)
                })
                .catch(console.error);
        } else {
            return message.say(text);
        }
    }
};