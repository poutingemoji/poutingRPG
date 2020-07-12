const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class OwnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'owner',
			aliases: [],
			group: 'info',
			memberName: 'owner',
            description: "Shows the owner of this bot.",
            examples: [`${prefix}owner`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [],
            throttling: {
                usages: 1,
                duration: 3
            },
        });
    };
    run(message) {
        message.say(randomTip(message, `${message.client.emojis.cache.get("729209778898862171").toString()} **${message.author.username}**, the Naruto Uzumaki to my Boruto Uzumaki is **poutingemoji#5785**. Nin!`));
    };
};
