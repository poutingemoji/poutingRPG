require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { emoji } = require('../../utils/Helper')

const { Parser } = require('expr-eval')

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
  run(msg, {equation}) {
    try {
      let evaluatedEquation = Parser.evaluate(equation)
      const messageEmbed = new MessageEmbed()
        .setColor('#ed7220')
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .addFields(
          { name: 'Equation', value: Helper.codeBlock(equation, "py")},
          { name: 'Result', value: Helper.codeBlock(evaluatedEquation, "py")},
        )
        .setTimestamp()
        .setFooter("Calculated")
      msg.say(messageEmbed)
    } catch (err) {
      console.error(err)
      return msg.say(`${emoji(msg,'err')} The equation provided could not be evaluated.`)
    }
  }
}