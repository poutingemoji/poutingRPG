const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const { Parser } = require('expr-eval')
const Helper = require('../../utils/Helper')
require('dotenv').config()

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['math', 'calculate', 'evaluate'],
			group: 'utility',
			memberName: 'math',
      description: 'Calculates the provided equation.',
      examples: [`${process.env.PREFIX}math [equation]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: false,
      args: [
        {
          key: 'equation',
          prompt: 'What would you like to calculate?',
          type: 'string',
        },
      ],
      throttling: {
        usages: 1,
        duration: 2
      },
    })
  }
  run(message, {equation}) {
    try {
      let evaluatedEquation = Parser.evaluate(equation)
      const messageEmbed = new MessageEmbed()
        .setColor('#ed7220')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addFields(
          { name: 'Equation', value: Helper.mlcb(equation, "py")},
          { name: 'Result', value: Helper.mlcb(evaluatedEquation, "py")},
        )
        .setTimestamp()
        .setFooter("Calculated")
      message.say(messageEmbed)
    } catch (err) {
      console.error(err)
      return message.say(Helper.emojiMsg(message, "left", ["err"], `The equation provided could not be evaluated.`))
    }
  }
}