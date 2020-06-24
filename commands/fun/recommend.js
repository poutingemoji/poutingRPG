const { prefix, color} = require('../../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'recommend',
	description: 'Recommend an anime to me.',
    aliases: [],
	cooldown: 3,
	usage: '[command name]',
	args: false,
    guildOnly: true,
    
	execute(message, args) {
		const data = [];
        const { commands } = message.client;
        const animeRecommendations = {
            0 :    {
                Name: 'Classroom of the Elite',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643829899133018/99a52a1a-401b-44b6-9974-ae8ad7baca96.png',
                AuthorID: '257641125135908866',
                Rating: 10,
                },
            1 :    {
                Name: 'Charlotte',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643921783619624/220px-Charlotte_key.png',
                AuthorID: '257641125135908866',
                Rating: 10,
                },
            2 :    {
                Name: 'Steins;Gate',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642736468983869/unknown.png',
                AuthorID: '423317547920916492',
                Rating: 10,
            },
            3 :    {
                Name: 'A Silent Voice',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643739322875975/ASV_DVD_Cover_72dpi.png',
                AuthorID: '423317547920916492',
                Rating: 10,
            },
            4 :    {
                Name: 'I want to eat your pancreas',
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643535978823720/51KDElH2RsL.png',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            5 :    {
                Name: "Rascal Does Not Dream of Bunny Girl Senpai",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643341644267570/216_636967475462893870Ao_Buta_Small.png',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            6 :    {
                Name: "Masamune-kun's Revenge",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722643036680617994/masamune-kuns-revenge-7967.png',
                AuthorID: '423317547920916492',
                Rating: 8,
            },
            7 :    {
                Name: "Hunter × Hunter",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642778160627743/02e1645a-f521-435e-b8bb-66948c562956_1.png',
                AuthorID: '423317547920916492',
                Rating: 9,
            },
            8 :    {
                Name: "Bleach",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642635470274591/220px-Bleachanime.png',
                AuthorID: '423317547920916492',
                Rating: 8,
            },
            9 :    {
                Name: "Prison School",
                Image: 'https://cdn.discordapp.com/attachments/672291271880212530/722642494197727272/4917066.png',
                AuthorID: '423317547920916492',
                Rating: 7,
            },
        }
        var animeIndex = Math.floor(Math.random() * Object.keys(animeRecommendations).length)
        var anime = animeRecommendations[animeIndex]
        async function recommendAnime() {
            try {
            const currentAuthor =  await client.users.fetch(anime.AuthorID)
                console.log(currentAuthor)
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(anime.Name)
                    .setAuthor(currentAuthor.username, currentAuthor.displayAvatarURL())
                    .setDescription(`test`)
                    .setImage(anime.Image)
                console.log(anime.Name)
                message.channel.send(exampleEmbed)
            } catch(err) {
                console.error('couldnt grab author')
            }
        }
        recommendAnime()
	}
}