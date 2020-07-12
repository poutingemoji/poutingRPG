const { Command } = require('discord.js-commando');

module.exports = class PoutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pout',
			aliases: [],
			group: 'fun',
			memberName: 'pout',
            description: 'Displays a random pout gif.',
            examples: [],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [],
            throttling: {
                usages: 1,
                duration: 4
            },
        });
    };
    run(message) { 
        message.say(gifs.next().value);
    };
};

function* infiniteShuffle(array) {
    const cloneArray = [...array]
    var i = array.length;
    while (i--) {
        console.log(array)
        yield array.splice(Math.floor(Math.random() * (i+1)), 1);
        if (i < 1) {
            array = [...cloneArray]
            i = array.length
        }
    }
}

const gifs = infiniteShuffle([
    "https://tenor.com/view/senko-poute-hmph-pouting-mope-sulk-gif-15650605",
    "https://tenor.com/view/anime-gifs-to-communicate-gifs-reaction-gifs-reaction-anime-kawaii-gif-14065051",
    "https://tenor.com/view/cute-pouting-pout-anime-girl-gif-14739721",
    "https://tenor.com/view/anime-pouting-angry-pissed-gif-14210734",
    "https://tenor.com/view/raphtalia-anime-pouting-gif-14210688",
    "https://tenor.com/view/pouting-anime-girl-cute-mad-gif-17164029",
    "https://tenor.com/view/pokemon-jigglypuff-angry-frustrated-puff-gif-5688400",
    "https://tenor.com/view/cute-girl-pouting-pout-anime-gif-14716136",
])