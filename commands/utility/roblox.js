const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class RobloxCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roblox',
			aliases: [],
			group: 'utility',
			memberName: 'roblox',
            description: 'Provides a link to a game on ROBLOX.',
            examples: [`${prefix}roblox [game]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'game',
                    prompt: "What game on ROBLOX would you like the link to?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {game}) {
        game = game.toLowerCase()
        let placeID = game
        if (isNaN(game)) {
            placeID =  placeIDs[game]
        }
        message.say(`https://www.roblox.com/games/${placeID}`)
    };
};

const placeIDs = {
    ["qclash"] : "2029250188",
    ["arsenal"] : "286090429",
}