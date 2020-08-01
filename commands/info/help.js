const { Command } = require('discord.js-commando')
require('dotenv').config()

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: [],
			group: 'info',
			memberName: 'help',
            description: "Link to the command list.",
            examples: [`${process.env.PREFIX}help`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [],
            throttling: {
                usages: 1,
                duration: 5
            },
        })
    }
    run(message) {
        message.say("https://poutingemoji.github.io/poutingbot/commands.html")
    }
}
