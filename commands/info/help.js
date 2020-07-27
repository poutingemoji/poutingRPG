const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: [],
			group: 'info',
			memberName: 'help',
            description: "Link to the command list.",
            examples: [`${prefix}help`],
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
    async run(message) {
        const messages = [];
        try {
            message.direct("https://poutingemoji.github.io/poutingbot/commands.html")
            if(message.channel.type !== 'dm') messages.push(await message.reply('Sent you a DM with information.'));
        } catch(err) {
            messages.push(await message.reply('Unable to send you the help DM. You probably have DMs disabled.'));
        }
    };
}
