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
            description: 'Google translator in Discord.',
            examples: [`${prefix}translate french baguette`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'language',
                    prompt: 'What language would you like to translate to?',
                    type: 'string',
                },
                {
                    key: 'content',
                    prompt: 'What would you like to say in this language?',
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
        const opts = {
            to: translate.languages.getCode(language.toLowerCase()), 
        };
        translate(content, opts)
            .then(response => {
                if (!translate.languages.getCode(language)) return message.say(`${emoji(message, "729190277511905301")} The language, **${titleCase(language)}**, doesn't exist in my database.`)
                const translateEmbed = new MessageEmbed()
                    .setColor("#4c8cf5")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .addFields(
                        {name: translate.languages[response.from.language.iso], value: "```\n" + content + "\n```"},
                    )
                    .setTimestamp()
                    .setFooter("Translated")
                if (language.length !== 2) {
                    translateEmbed.addField(titleCase(language), "```\n" + response.from.text.value + "\n```")
                } else {
                    translateEmbed.addField(translate.languages[language], "```\n" + response.from.text.value + "\n```")
                }
                message.say(randomTip(message, translateEmbed))
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