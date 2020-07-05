const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class OwnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'owner',
			aliases: [],
			group: 'info',
			memberName: 'owner',
            description: "This is my owner.",
            examples: [`${prefix}owner`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        });
    };
    run(message) {
        return message.say(`${message.client.emojis.cache.get("729209778898862171").toString()} **${message.author.username}**, the Naruto Uzumaki to my Boruto Uzumaki is **poutingemoji#5785**. Nin!`);
    };
};
