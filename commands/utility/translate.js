require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { titleCase, codeBlock } = require('../../utils/Helper')
const { emoji } = require('../../utils/msgHelper')

const translate = require('@vitalets/google-translate-api')

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['ts'],
			group: 'utility',
			memberName: 'translate',
      description: 'Translates the text into the specified language.',
      examples: [`${client.commandPrefix}translate [language/ISO 639-1] [text]`],
      clientPermissions: [],
      userPermissions: [],
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
  run(msg, {language, content}) {
    if (language.toLowerCase() === "chinese" || language.toLowerCase() === "ch") language = "Chinese (Simplified)"
    if (!translate.languages.getCode(language)) return msg.say(`${emoji(msg,'err')} ${msg.author}, the language, **${titleCase(language)}**, doesn't exist in my database.`)
    const opts = {
      to: translate.languages.getCode(language.toLowerCase()), 
    }
    translate(content, opts)
      .then(res => {
        const messageEmbed = new MessageEmbed()
          .setColor("#4c8cf5")
          .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
          .addField(translate.languages[res.from.language.iso], codeBlock(content))
          .setTimestamp()
          .setFooter("Translated")
        language.length !== 2 ? messageEmbed.addField(titleCase(language), codeBlock(res.text)) : messageEmbed.addField(translate.languages[language], codeBlock(res.text))
        msg.say(messageEmbed)
      })
      .catch(err => {
        console.error(err)
      })
  }
}