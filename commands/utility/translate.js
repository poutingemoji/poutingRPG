const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const translate = require('@vitalets/google-translate-api')
const hfuncs = require('../../functions/helper-functions')
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
        if (language.toLowerCase() === "chinese" || language.toLowerCase() === "ch") {
            language = "Chinese (Simplified)"
        }
        if (!translate.languages.getCode(language)) return message.say(`${hfuncs.emoji(message, "729190277511905301")} **${message.author.username}**, the language, **${hfuncs.titleCase(language)}**, doesn't exist in my database.`)
        const opts = {
            to: translate.languages.getCode(language.toLowerCase()), 
        }
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
                    messageEmbed.addField(hfuncs.titleCase(language), "```\n" + result.text + "\n```")
                } else {
                    messageEmbed.addField(translate.languages[language], "```\n" + result.text + "\n```")
                }
                message.say(messageEmbed)
            })
            .catch(console.error)
    }
}