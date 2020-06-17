const { prefix } = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'recommend',
	description: 'Recommend an anime to me.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 3,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;
        var animeRecommendations = {
            0 :    {
                Name: 'Classroom of the Elite',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643829899133018/99a52a1a-401b-44b6-9974-ae8ad7baca96.png',
                Color: '#9f3253',
                AuthorID: '257641125135908866',
                Rating: 10,
                },
            1 :    {
                Name: 'Charlotte',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643921783619624/220px-Charlotte_key.png',
                Color: '45b1d7',
                AuthorID: '257641125135908866',
                Rating: 10,
                },
            2 :    {
                Name: 'Steins;Gate',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642736468983869/unknown.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 10,
            },
            3 :    {
                Name: 'A Silent Voice',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643739322875975/ASV_DVD_Cover_72dpi.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 10,
            },
            4 :    {
                Name: 'I want to eat your pancreas',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643535978823720/51KDElH2RsL.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            5 :    {
                Name: "Rascal Does Not Dream of Bunny Girl Senpai",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643341644267570/216_636967475462893870Ao_Buta_Small.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            6 :    {
                Name: "Masamune-kun's Revenge",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643036680617994/masamune-kuns-revenge-7967.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 8,
            },
            7 :    {
                Name: "Hunter × Hunter",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642778160627743/02e1645a-f521-435e-b8bb-66948c562956_1.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            8 :    {
                Name: "Bleach",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642635470274591/220px-Bleachanime.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 8,
            },
            9 :    {
                Name: "Prison School",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642494197727272/4917066.png',
                Color: '45b1d7',
                AuthorID: '423317547920916492',
                Rating: 7,
            },
        }
        var animeIndex = Math.floor(Math.random() * Object.keys(animeRecommendations).length);
        var anime = animeRecommendations[animeIndex]
        var currentAuthor = client.guilds.resolve(message.guild).members.resolve(anime.AuthorID).user
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#b0daaa')
        .setTitle(anime.Name)
        .setAuthor(currentAuthor.username, currentAuthor.displayAvatarURL())
        .setDescription(`Rating: ${anime.Rating}/10`)
        .setImage(anime.Image)
    console.log(anime.Name)
    message.channel.send(exampleEmbed);
	},
};