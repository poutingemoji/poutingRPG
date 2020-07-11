const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix } = require("../../config.json");
const { compositionDependencies } = require('mathjs');
const lngDetector = new (require('languagedetect'));

module.exports = class WhatLanguageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whatlanguage',
			aliases: [],
			group: 'utility',
			memberName: 'whatlanguage',
            description: 'Tells you what language your text is in.',
            examples: [`${prefix}whatlanguage [text]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text do you want to guess the language of?',
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
        let languages = lngDetector.detect(text, 6)
        const whatLanguageEmbed = new MessageEmbed()
            .setColor('#da2063')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription("```\n" + text + "\n```")
            .setTimestamp()
            .setFooter("Tested")
        let counter = 0;
        languages.map(language => {
            counter++,
            whatLanguageEmbed.addField(titleCase(`${counter}. ${language[0]}`), round(language[1] * 100, 1) + "%", true)
        }) 

        message.say(whatLanguageEmbed)
    };
};

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function titleCase(str) {
    str = str.replace(/_/g, " ")
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}