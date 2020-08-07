const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Genius = new (require("genius-lyrics")).Client(process.env.GENIUSLYRICSKEY)
const typ = require('../../helpers/typ')
require('dotenv').config()

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			aliases: [],
			group: 'utility',
			memberName: 'lyrics',
            description: 'Display the lyrics of the requested song.',
            examples: [`${process.env.PREFIX}lyrics [song]`],
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
        })
    }
    async run(message, {song}) {
        const sentMessage = await message.say(`${typ.emoji(message,"730597505938620437")} **${message.author.username}**, searching for requested song lyrics... \:mag_right: `)
        try {
            const songs = await Genius.tracks.search(song, { limit: 10 })
            const lyricsRequest = await songs[0].lyrics()
            const messageEmbed = new MessageEmbed()
                .setColor("#fffa64")
                .setDescription(truncateText(lyricsRequest))
            sentMessage.delete()
            message.say(messageEmbed)
        } catch(err) {
            console.error(err)
            sentMessage.edit(typ.emojiMsg(message, ["err"], `Couldn't find lyrics for the song, **${song}**`))
        }
    }
}

function truncateText(str) {
    const length = 2048
    const ending = '...'
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending
    } else {
      return str
    }
}
