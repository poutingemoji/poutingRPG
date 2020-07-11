const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs')
const { prefix } = require("../../config.json");

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['math', 'calc', 'calculate'],
			group: 'utility',
			memberName: 'math',
            description: 'A calculator in Discord.',
            examples: [`${prefix}math (5+3)/2`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
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
        });
    };
    run(message, {equation}) {
        let evaluatedEquation;
        try {
            evaluatedEquation = math.evaluate(equation);
        } catch (error) {
            return message.say(`${emoji(message, "729190277511905301")} Equation provided could not be evaluated.`)
        };
        const calculationEmbed = new MessageEmbed()
            .setColor('#ed7220')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addFields(
                { name: 'Equation', value: "```py\n" + equation + "\n```"},
                { name: 'Result', value: "```py\n" + evaluatedEquation + "\n```"},
            )
            .setTimestamp()
            .setFooter("Calculated")
        return message.say(randomTip(message, calculationEmbed));
    };
};

