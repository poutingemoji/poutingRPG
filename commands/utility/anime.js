const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix } = require("../../config.json");
const fetch = require("node-fetch")
const checkDict = {
    status: "Status",
    episodeCount: "Episodes",
    averageRating: "Rating",
    showType: "Show Type",
    startDate: "Start Date",
    endDate: "End Date",
}

module.exports = class AnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime',
			aliases: [],
			group: 'utility',
			memberName: 'anime',
            description: 'Search for info about your favorite anime!',
            examples: [`${prefix}anime [name of anime]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                    key: 'anime',
                    prompt: "What's the name of the anime you would like to know more about?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {anime}) {
        try {
            var sentMessage = await message.say(`${emoji(message,"730597505938620437")} Searching database for requested anime... \:mag_right: `);
            var animeRequest = await fetchAnimeInfo(`https://kitsu.io/api/edge/anime?filter[text]=${anime}`)
            if (animeRequest["data"][0] === undefined) return sentMessage.edit(`${emoji(message,"729190277511905301")} Request failed! Could not find the requested anime.`);
        } catch(err) {
            console.log(err)
        };
        console.log(sentMessage)
        let i = 0;
        const possibleMatches = animeRequest["data"].map(anime => {
            i++;
            return "**" + i + "** : " + anime["attributes"]['canonicalTitle'];
        });
        console.log(possibleMatches)
        sentMessage.edit(`${emoji(message,"729255616786464848")}${emoji(message,"729255637837414450")} **${message.author.username}**, I have found about 10 results (0.69 seconds), please pick the one you meant.\n${possibleMatches.join("\n")}`)
        const filter = m => [1,2,3,4,5,6,7,8,9,10].includes(parseInt(m.content));
        const collector = message.channel.createMessageCollector(filter, { time: 6000 });
        let animeInfo;
        collector.on('collect', m => {
            animeInfo = animeRequest["data"][parseInt(m)-1]["attributes"]
            sentMessage.delete()
            console.log(animeInfo)
            const animeEmbed = new MessageEmbed()
                .setColor('#ed7220')
                .setTitle(`${animeInfo["titles"]["ja_jp"]} - ${animeInfo["canonicalTitle"]}`)
                .setURL(`https://kitsu.io/anime/${animeRequest["data"][parseInt(m)-1]["id"]}`)
                .setThumbnail(animeInfo["posterImage"]["original"])
                .setDescription(animeInfo["synopsis"])
            console.log(animeInfo["synopsis"])
            Object.keys(checkDict).forEach(function(check) {
                console.log(check)
                if (animeInfo[check]) {
                    animeEmbed.addField(checkDict[check], animeInfo[check], true)
                 }
             });
            if (animeInfo["nextRelease"]) {
                animeEmbed.setFooter(`Next Release: ${dateFormat(animeInfo["nextRelease"], "dddd, mmmm dS, yyyy, h:MM TT")}`)
            }
            return message.say(randomTip(message, animeEmbed));    
        });
        collector.on('end', collected => {
            if (!collected) {
                return message.say(`${emoji(message,"729204396726026262")}**${message.author.username}**, what's taking so long bruh? This search is cancelled.`)
            }
        });
    };
};

async function fetchAnimeInfo(URL) {
    const res = await fetch(URL)
    return await res.json();
}

function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}


 