const { Command } = require('discord.js-commando');

module.exports = class AgreeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'agree',
			aliases: [],
			group: 'fun',
			memberName: 'agree',
            description: 'Displays a random agree gif.',
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
    "https://tenor.com/view/nodding-crossed-arms-pikachu-eyes-closed-pokemon-gif-15194868",
    "https://tenor.com/view/yes-anime-nods-agree-gif-14855108",
    "https://tenor.com/view/anime-zero-two-cute-smile-nod-gif-13451534",
    "https://tenor.com/view/yep-gif-4361784",
    "https://tenor.com/view/ranma-ranma-one-half-shampoo-anime-90s-gif-15175750",
    "https://tenor.com/view/jotaro-kujo-yes-jojo-distorted-anime-gif-17239598",
    "https://tenor.com/view/ngnl-no-game-no-life-shiro-sora-anime-gif-17083387",
    "https://tenor.com/view/anime-konosuba-shake-head-ok-yes-gif-16705379",

])