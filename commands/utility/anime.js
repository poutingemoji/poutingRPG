const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const dateFormat = require('dateformat')
const fetch = require("node-fetch")
const typ = require('../../utils/typ')
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
          prompt: "What anime you would like to know more about?",
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
    try {
      var sentMessage = await message.say(typ.emojiMsg(message, "left", ["loading"], `Searching for requested anime... \:mag_right:`))
      var animeRequest = await fetchAnimeInfo(`https://kitsu.io/api/edge/anime?filter[text]=${anime}`)
      if (animeRequest["data"][0] === undefined) return sentMessage.edit(typ.emojiMsg(message, "left", ["err"], `Could not find info on ${anime}`))
    } catch(err) {
      console.error(err)
    }
    anime = animeRequest["data"]
    console.log(sentMessage)
    let options = []
    let possibleMatches = ''
    for (let i = 0; i < anime.length; i++) {
      const index = i+1
      options.push(index)
      possibleMatches += `**${index}** : ${anime[i]["attributes"]['canonicalTitle']}\n`
    }
    const filter = response => options.includes(parseInt(response.content))
    let animeInfo
    sentMessage.edit(typ.emojiMsg(message, "left", ["prompt1", "prompt2"], `I have found about ${animeRequest["data"].length} results, please pick the one you meant.\n${possibleMatches}`, true)).then(() => {
      message.channel.awaitMessages(filter, { max: 1, time: 12000 })
        .then(result => {
          const chosenAnimeIndex = result.first().content-1
          animeInfo = animeRequest["data"][chosenAnimeIndex]["attributes"]
          sentMessage.delete()
          //console.log(animeInfo)
          const title = animeInfo["titles"]["ja_jp"] ? `${animeInfo["titles"]["ja_jp"]} - ${animeInfo["canonicalTitle"]}` : animeInfo["canonicalTitle"]
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
        .catch(err => {
          console.error(err)
          message.say(typ.emojiMsg(message, "left", ["err"], "you didn't answer in time. This search is cancelled.", true))
        })
    })
  }
}

async function fetchAnimeInfo(URL) {
  const res = await fetch(URL)
  return await res.json()
}

 