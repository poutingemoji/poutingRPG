const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix, color } = require("../../config.json");

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pat',
			aliases: [],
			group: 'fun',
			memberName: 'pat',
            description: 'Sometimes people just need a pat on the head...',
            examples: [`${prefix}pat @user`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: "Who'd you like to pat on the head?",
                    type: 'user',
                    default: "client"
                },
            ],
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    run(message, {user}) { 
        if (user === "client") {
            user = message.client.user
        }
        const patEmbed = new MessageEmbed()
            .setColor(color)
            .setDescription(`${message.client.emojis.cache.get("729495883078697081").toString()} **${message.author.username}** pats **${user.username}**`)
            .setImage(pats[Math.floor(Math.random() * pats.length)])
            .setTimestamp()
            .setFooter('Pat');
        message.say(randomTip(message, patEmbed));
    };
};

const pats = [
    "https://cdn.weeb.sh/images/Byd3kktw-.gif", 
    "https://cdn.weeb.sh/images/BJp1lyYD-.gif", 
    "https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif", 
    "https://media.giphy.com/media/PHZ7v9tfQu0o0/giphy.gif", 
    "https://media.giphy.com/media/SSPW60F2Uul8OyRvQ0/giphy.gif", 
    "https://media.giphy.com/media/Z7x24IHBcmV7W/giphy.gif", 
    "https://media.giphy.com/media/4HP0ddZnNVvKU/giphy.gif", 
    "https://media.giphy.com/media/109ltuoSQT212w/giphy.gif", 
    "https://media.giphy.com/media/L2z7dnOduqEow/giphy.gif", 
]