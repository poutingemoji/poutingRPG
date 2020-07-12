const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class ChineseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chinese',
			aliases: [],
			group: 'fun',
			memberName: 'chinese',
            description: 'Converts your english letters into their corresponding Chinese letters.',
            examples: [`${prefix}chinese [text]`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert into Chinese letters?',
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
        message.delete();
        let formattedText = [];
        const alphabet = {
            ["A"]: "丹",
            ["B"]: "乃",
            ["C"]: "匚",
            ["D"]: "刀",
            ["E"]: "巳",
            ["F"]: "下",
            ["G"]: "呂",
            ["H"]: "卄",
            ["I"]: "工",
            ["J"]: "丿",
            ["K"]: "片",
            ["L"]: "乚",
            ["M"]: "爪",
            ["N"]: "冂",
            ["O"]: "口",
            ["P"]: "尸",
            ["Q"]: "Ｑ",
            ["R"]: "尺",
            ["S"]: "丂",
            ["T"]: "丁",
            ["U"]: "凵",
            ["V"]: "∨",
            ["W"]: "山",
            ["X"]: "乂",
            ["Y"]: "ㄚ",
            ["Z"]: "乙",
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