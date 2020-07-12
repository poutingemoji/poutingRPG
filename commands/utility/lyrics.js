const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix, GENIUSLYRICSKEY } = require("../../config.json");
const Genius = new (require("genius-lyrics")).Client(GENIUSLYRICSKEY);

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			aliases: [],
			group: 'utility',
			memberName: 'lyrics',
            description: 'Display the lyrics of the requested song.',
            examples: [`${prefix}lyrics [song]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'song',
                    prompt: "What song would you like to know the lyrics to?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {song}) {
        const sentMessage = await message.say(`${emoji(message,"730597505938620437")} Searching for requested song lyrics... \:mag_right: `);
        const lyricsRequest = await fetchLyricsInfo(song)
        console.log(lyricsRequest)
        if (!lyricsRequest) return sentMessage.edit(`${emoji(message, "729190277511905301")} I couldn't find lyrics for the song, **${song}**`)
        const lyricsEmbed = new MessageEmbed()
            .setColor("#fffa64")
            .setDescription(truncateText(lyricsRequest))
        sentMessage.delete()
        message.say(randomTip(lyricsEmbed))
    };
};

async function fetchLyricsInfo(query) {
    try {
        const songs = await Genius.tracks.search(query, { limit: 10 })
        return songs[0].lyrics()
    } catch(error) {
        console.log(error)
    }
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}

function truncateText(str) {
    const length = 2048;
    const ending = '...';
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
};
