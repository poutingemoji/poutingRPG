const { Command } = require('discord.js-commando');

module.exports = class ShrugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shrug',
			aliases: [],
			group: 'fun',
			memberName: 'shrug',
            description: 'Displays a random shrug gif.',
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
    "https://tenor.com/view/shrug-smug-smile-miss-kobayashi-kobayashisan-chi-no-maid-dragon-gif-13119038",
    "https://tenor.com/view/anime-shrug-maybe-idont-know-gif-14913933",
    "https://tenor.com/view/shrug-anime-non-non-biyori-renge-gif-9724581",
    "https://tenor.com/view/senyuu-anime-anime-boy-demon-teufel-diabolos-gif-14625512",
    "https://tenor.com/view/izaya-orihara-durarara-drrr-anime-shrug-gif-12286564",
    "https://tenor.com/view/anime-shrug-dont-know-idk-gif-15487155",
])