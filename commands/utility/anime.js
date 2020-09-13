require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { emoji } = require('../../utils/Helper')
const Requester = require('../../utils/Requester')

const dateFormat = require('dateformat')

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
      examples: [`${client.commandPrefix}anime [anime]`],
      clientPermissions: [],
      userPermissions: [],
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
  async run(msg, {anime}) {
    try {
      var sentMessage = await msg.say(`${emoji(msg,'loading')} Searching for requested anime... \:mag_right:`)
      var animeRequest = await Requester.request(`https://kitsu.io/api/edge/anime?filter[text]=${anime}`)
      if (animeRequest["data"][0] === undefined) return sentMessage.edit(`${emoji(msg,'err')} Could not find info on ${anime}`)
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
    sentMessage.edit(`${msg.author}, I have found about ${animeRequest["data"].length} results, please pick the one you meant.\n${possibleMatches}`).then(msgSent => {
      msgSent.channel.awaitMessages(filter, { max: 1, time: 12000 })
        .then(res => {
          const chosenAnimeIndex = res.first().content-1
          animeInfo = animeRequest["data"][chosenAnimeIndex]["attributes"]
          msgSent.delete()
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
          msg.say(messageEmbed)   
        })
        .catch(err => {
          console.error(err)
          msg.say(`${emoji(msg,'err')} ${msg.author}, you didn't answer in time. This search is cancelled.`)
        })
    })
  }
}