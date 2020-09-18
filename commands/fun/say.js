require('dotenv').config()
const { Command } = require('discord.js-commando')

const translate = require('@vitalets/google-translate-api')

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: [],
      group: 'fun',
      memberName: 'say',
      description: 'Makes the bot mimic what you say.',
      examples: [
        `${client.commandPrefix}say [text]`,
      ],
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: [],
      guildOnly: true,
      hidden: true,
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
    })
  }

  run(msg, { text }) {
    if (!['257641125135908866', '423317547920916492'].includes(msg.author.id)) return
    console.log(text)
    const args = text.split(" ")
    let mentions = []
    msg.delete()
    if (args[0].toLowerCase() === "chinese") {
      args[0] = "Chinese (Simplified)"
    }
    text = args.join(" ")
    if (translate.languages.getCode(args[0])) {
      let language = args[0]
      const opts = {
        to: translate.languages.getCode(language.toLowerCase()), 
      }
      translate(text.replace(args[0], ''), opts)
        .then(response => {
          msg.say(mentions.join(' ') + response.text)
        })
        .catch(console.error)
    } else {
      return msg.say(text)
    }
  }
}