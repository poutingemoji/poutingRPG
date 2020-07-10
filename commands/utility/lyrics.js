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
            description: 'Search up the lyrics to a song.',
            examples: [`${prefix}lyrics [name of song]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'query',
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
    async run(message, {query}) {
        const sentMessage = await message.say(`${emoji(message,"730597505938620437")} Searching database for requested song lyrics... \:mag_right: `);
        const lyricsRequest = await fetchLyricsInfo(query)
        if (!lyricsRequest) return sentMessage.edit(`${emoji(message, "729190277511905301")} I couldn't find lyrics for the song, **${query}**`)
        const lyricsEmbed = new MessageEmbed()
            .setColor("#fffa64")
            .setDescription(truncateText(lyricsRequest))
        sentMessage.delete()
        message.say(lyricsEmbed)
    };
};

async function fetchLyricsInfo(query) {
    let songs;
    try {
        songs = await Genius.tracks.search(query, { limit: 1 })
        return await songs[0].lyrics()
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
