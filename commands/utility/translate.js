const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const translate = require('@vitalets/google-translate-api')
const typ = require('../../helpers/typ')
require('dotenv').config()

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['ts'],
			group: 'utility',
			memberName: 'translate',
            description: 'Translates the text into the specified language.',
            examples: [`${process.env.PREFIX}translate [language/ISO 639-1] [text]`],
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
        })
    }
    run(message, {language, content}) {
        if (language.toLowerCase() === "chinese" || language.toLowerCase() === "ch") language = "Chinese (Simplified)"
        if (!translate.languages.getCode(language)) return message.say(typ.err(message, `the language, **${typ.titleCase(language)}**, doesn't exist in my database.`, true))
        const opts = {
            to: translate.languages.getCode(language.toLowerCase()), 
        }
        translate(content, opts)
            .then(result => {
                const messageEmbed = new MessageEmbed()
                    .setColor("#4c8cf5")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .addField(translate.languages[result.from.language.iso], typ.mlcb(content))
                    .setTimestamp()
                    .setFooter("Translated")
                language.length !== 2 ? messageEmbed.addField(typ.titleCase(language), typ.mlcb(result.text)) : messageEmbed.addField(translate.languages[language], typ.mlcb(result.text))
                message.say(messageEmbed)
            })
            .catch(err => {
                console.error(err)
            })
    }
}