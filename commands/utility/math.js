const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const { Parser } = require('expr-eval')
const typ = require('../../helpers/typ')
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
                    { name: 'Equation', value: "```py\n" + equation + "\n```"},
                    { name: 'Result', value: "```py\n" + evaluatedEquation + "\n```"},
                )
                .setTimestamp()
                .setFooter("Calculated")
            message.say(messageEmbed)
        } catch (error) {
            return message.say(typ.err(message, `The equation provided could not be evaluated.`))
        }
    }
}