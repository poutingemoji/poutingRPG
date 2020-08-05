const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const dateFormat = require('dateformat')
const fetch = require("node-fetch")
const hfuncs = require('../../functions/helper-functions')
require('dotenv').config()

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
            description: 'Displays info of the requested anime.',
            examples: [`${process.env.PREFIX}anime [anime]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
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
        })
    }
    async run(message, {anime}) {
        const start = Date.now()
        try {
            var sentMessage = await message.say(`${hfuncs.emoji(message,"730597505938620437")} Searching for requested anime... \:mag_right: `)
            var animeRequest = await fetchAnimeInfo(`https://kitsu.io/api/edge/anime?filter[text]=${anime}`)
            if (animeRequest["data"][0] === undefined) return sentMessage.edit(`${hfuncs.emoji(message,"729190277511905301")} Request failed! Could not find info on ${anime}`)
        } catch(error) {
            console.log(error)
        }
        console.log(sentMessage)
        let i = 0
        const possibleMatches = animeRequest["data"].map(anime => {
            i++
            return "**" + i + "** : " + anime["attributes"]['canonicalTitle']
        })
        console.log(possibleMatches)
        const filter = response => [1,2,3,4,5,6,7,8,9,10].includes(parseInt(response.content))
        let animeInfo
        sentMessage.edit(`${hfuncs.emoji(message,"729255616786464848")}${hfuncs.emoji(message,"729255637837414450")} **${message.author.username}**, I have found about 10 results (${(Date.now() - start)/1000} seconds), please pick the one you meant.\n${possibleMatches.join("\n")}`).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 12000 })
                .then(result => {
                    const chosenAnimeIndex = (parseInt(result.first().content))-1
                    animeInfo = animeRequest["data"][chosenAnimeIndex]["attributes"]
                    sentMessage.delete()
                    //console.log(animeInfo)
                    let title
                    if (!animeInfo["titles"]["ja_jp"]) {
                        title = animeInfo["canonicalTitle"]
                    } else {
                        title = `${animeInfo["titles"]["ja_jp"]} - ${animeInfo["canonicalTitle"]}`
                    }
                    const messageEmbed = new MessageEmbed()
                        .setColor('#ed7220')
                        .setTitle(title)
                        .setURL(`https://kitsu.io/anime/${animeRequest["data"][chosenAnimeIndex]["id"]}`)
                        .setThumbnail(animeInfo["posterImage"]["original"])
                        .setDescription(animeInfo["synopsis"])
                    Object.keys(checkDict).forEach(function(check) {
                        console.log(check)
                        if (animeInfo[check]) {
                            messageEmbed.addField(checkDict[check], animeInfo[check], true)
                         }
                     })
                    if (animeInfo["nextRelease"]) {
                        messageEmbed.setFooter(`Next Release: ${dateFormat(animeInfo["nextRelease"], "dddd, mmmm dS, yyyy, h:MM TT")}`)
                    }
                    message.say(messageEmbed)   
                })
                .catch(result => {
                    message.say(`${hfuncs.emoji(message,"729204396726026262")} **${message.author.username}**, you didn't answer in time. This search is cancelled.`)
                })
        })
    }
}

async function fetchAnimeInfo(URL) {
    const res = await fetch(URL)
    return await res.json()
}

 