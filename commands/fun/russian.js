const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class RussianCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'russian',
			aliases: [],
			group: 'fun',
			memberName: 'russian',
            description: 'Converts your english letters into their corresponding Russian letters.',
            examples: [`${prefix}russian [text]`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert into Russian letters?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message, {text}) {
        message.delete()
        let formattedText = [];
        const alphabet = {
            ["A"]: "Д",
            ["B"]: "Б",
            ["C"]: "Ҫ",
            ["D"]: "D",
            ["E"]: "Ԑ",
            ["F"]: "Ӻ",
            ["G"]: "G",
            ["H"]: "Ң",
            ["I"]: "Ї",
            ["J"]: "J",
            ["K"]: "Ԟ",
            ["L"]: "L",
            ["M"]: "爪",
            ["N"]: "Ѝ",
            ["O"]: "Ф",
            ["P"]: "P",
            ["Q"]: "Q",
            ["R"]: "Я",
            ["S"]: "S",
            ["T"]: "Ҭ",
            ["U"]: "Џ",
            ["V"]: "V",
            ["W"]: "Ш",
            ["X"]: "Ж",
            ["Y"]: "Ұ",
            ["Z"]: "Z",
        }
        for (let letter of text) {
            if (validate(letter)) {
                formattedText.push(alphabet[letter.toUpperCase()])
            } else {
                formattedText.push(" " + letter + " ")
            }
        }
        formattedText = formattedText.join("")
        message.say(randomTip(message, `${message.client.emojis.cache.get("729204396726026262").toString()}**${message.author.username}** : ${formattedText}`));
    };
};

function validate(strValue) {
    var objRegExp  = /^[a-z\u00C0-\u00ff]+$/;
    return objRegExp.test(strValue);
}