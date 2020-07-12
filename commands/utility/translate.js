const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix } = require("../../config.json");
const translate = require('@vitalets/google-translate-api');

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['ts'],
			group: 'utility',
			memberName: 'translate',
            description: 'Translates the text into the specified language.',
            examples: [`${prefix}translate [language/ISO 639-1] [text]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'language',
                    prompt: 'What language would you like to translate to?',
                    type: 'string',
                },
                {
                    key: 'content',
                    prompt: 'What would you like to translate in this language?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message, {language, content}) {
        if (language.toLowerCase() === "chinese") {
            language = "Chinese (Simplified)"
        }
        if (!translate.languages.getCode(language)) return message.say(`${emoji(message, "729190277511905301")} The language, **${titleCase(language)}**, doesn't exist in my database.`)
        const opts = {
            to: translate.languages.getCode(language.toLowerCase()), 
        };
        translate(content, opts)
            .then(result => {
                const messageEmbed = new MessageEmbed()
                    .setColor("#4c8cf5")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .addFields(
                        {name: translate.languages[result.from.language.iso], value: "```\n" + content + "\n```"},
                    )
                    .setTimestamp()
                    .setFooter("Translated")
                if (language.length !== 2) {
                    messageEmbed.addField(titleCase(language), "```\n" + result.text + "\n```")
                } else {
                    messageEmbed.addField(translate.languages[language], "```\n" + result.text + "\n```")
                }
                message.say(randomTip(message, messageEmbed))
            })
            .catch(console.error);
    };
};

function titleCase(str) {
    str = str.replace(/_/g, " ")
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}