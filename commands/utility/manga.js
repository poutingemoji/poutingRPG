const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat')
const { prefix } = require("../../config.json");
const fetch = require("node-fetch");

const checkDict = {
    status: "Status",
    episodeCount: "Episodes",
    averageRating: "Rating",
    showType: "Show Type",
    startDate: "Start Date",
    endDate: "End Date",
}

module.exports = class MangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'manga',
			aliases: [],
			group: 'utility',
			memberName: 'manga',
            description: 'Displays info of the requested manga.',
            examples: [`${prefix}manga [manga]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'manga',
                    prompt: "What's the name of the manga you would like to know more about?",
                    type: 'string',
                },
            ],
 
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {manga}) {
        try {
            var sentMessage = await message.say(`${emoji(message,"730597505938620437")} Searching for requested manga... \:mag_right: `);
            var mangaRequest = await fetchAnimeInfo(`https://kitsu.io/api/edge/manga?filter[text]=${manga}`)
            if (mangaRequest["data"][0] === undefined) return sentMessage.edit(`${emoji(message,"729190277511905301")} Request failed! Could not find info on ${manga}`);
        } catch(error) {
            console.log(error)
        };
        console.log(sentMessage)
        let i = 0;
        const possibleMatches = mangaRequest["data"].map(manga => {
            i++;
            return "**" + i + "** : " + manga["attributes"]['canonicalTitle'];
        });
        console.log(possibleMatches)
        const filter = response => [1,2,3,4,5,6,7,8,9,10].includes(parseInt(response.content));
        let mangaInfo;
        sentMessage.edit(`${emoji(message,"729255616786464848")}${emoji(message,"729255637837414450")} **${message.author.username}**, I have found about 10 results (0.69 seconds), please pick the one you meant.\n${possibleMatches.join("\n")}`).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 12000 })
                .then(collected => {
                    const chosenMangaIndex = (parseInt(collected.first().content))-1
                    mangaInfo = mangaRequest["data"][chosenMangaIndex]["attributes"]
                    sentMessage.delete()
                    //console.log(mangaInfo)
                    let title;
                    if (!mangaInfo["titles"]["ja_jp"]) {
                        title = mangaInfo["canonicalTitle"]
                    } else {
                        title = `${mangaInfo["titles"]["ja_jp"]} - ${mangaInfo["canonicalTitle"]}`
                    }
                    const messageEmbed = new MessageEmbed()
                        .setColor('#ed7220')
                        .setTitle(title)
                        .setURL(`https://kitsu.io/anime/${mangaRequest["data"][chosenAnimeIndex]["id"]}`)
                        .setThumbnail(mangaInfo["posterImage"]["original"])
                        .setDescription(mangaInfo["synopsis"])
                    Object.keys(checkDict).forEach(function(check) {
                        console.log(check)
                        if (mangaInfo[check]) {
                            messageEmbed.addField(checkDict[check], mangaInfo[check], true)
                         }
                     });
                    if (mangaInfo["nextRelease"]) {
                        messageEmbed.setFooter(`Next Release: ${dateFormat(mangaInfo["nextRelease"], "dddd, mmmm dS, yyyy, h:MM TT")}`)
                    }
                    message.say(messageEmbed);    
                })
                .catch(collected => {
                    message.say(`${emoji(message,"729204396726026262")}**${message.author.username}**, what's taking so long bruh? This search is cancelled.`)
                });
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


 