const math = require('mathjs')
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['math', 'calc', 'calculate'],
			group: 'utility',
			memberName: 'math',
            description: 'A calculator in Discord.',
            args: [
                {
                    key: 'equation',
                    prompt: 'What would you like to calculate?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 1
            },
        });
    };
    run(message, {equation}) {
        let evaluatedEquation;
        try {
            evaluatedEquation = math.evaluate(equation);
            console.log(evaluatedEquation)
        } catch (error) {
            return message.channel.send("Equation provided could not be evaluated.")
        };

        const calculationEmbed = new MessageEmbed()
            .setColor('#000000')
            .setAuthor( message.author.tag, message.author.displayAvatarURL() )
            .addFields(
                { name: 'Equation', value: "`" + equation + "`"},
                { name: 'Result', value: evaluatedEquation },
            )
            .setTimestamp()
        message.channel.send(calculationEmbed);
    };
};
