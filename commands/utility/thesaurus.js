const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix } = require("../../config.json");
const tcom = require('thesaurus-com');

module.exports = class ThesaurusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thesaurus',
			aliases: [],
			group: 'utility',
			memberName: 'thesaurus',
            description: 'Thesaurus.com in Discord.',
            examples: [`${prefix}thesaurus never`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'term',
                    prompt: 'What term would you like to know the synonyms and antonyms to?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message, {term}) {
        console.log(tcom.search(term))
    };
};

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