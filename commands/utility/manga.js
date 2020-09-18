require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { emoji } = require('../../utils/msgHelper')
const Requester = require('../../utils/Requester')

const dateFormat = require('dateformat')

const checkDict = {
  status: "Status",
  volumeCount: "Volumes",
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
      examples: [
        `${client.commandPrefix}manga [manga]`,
      ],
      clientPermissions: [],
      userPermissions: [],
      args: [
        {
          key: 'manga',
          prompt: "What manga you would like to know more about?",
          type: 'string',
        },
      ],
      throttling: {
        usages: 1,
        duration: 10
      },
    })
  }
  async run(msg, {manga}) {
    try {
      var sentMessage = await msg.say(`${emoji(msg,'loading')} Searching for requested manga... \:mag_right:`)
      var mangaRequest = await Requester.request(`https://kitsu.io/api/edge/manga?filter[text]=${manga}`)
      console.log(mangaRequest["data"][1])
      if (mangaRequest["data"][0] === undefined) return sentMessage.edit(`${emoji(msg,'err')} Could not find info on ${manga}`)
    } catch(err) {
      console.error(err)
    }
    manga = mangaRequest["data"]
    console.log(sentMessage)
    let options = []
    let possibleMatches = ''
    for (let i = 0; i < manga.length; i++) {
      const index = i+1
      options.push(index)
      possibleMatches += `**${index}** : ${manga[i]["attributes"]['canonicalTitle']}\n`
    }
    const filter = response => options.includes(parseInt(response.content))
    let mangaInfo
    sentMessage.edit(`${msg.author}, I have found about ${mangaRequest["data"].length} results, please pick the one you meant.\n${possibleMatches}`)
      .then(msgSent => {
      msgSent.channel.awaitMessages(filter, { max: 1, time: 12000 })
        .then(res => {
          const chosenMangaIndex = res.first().content-1
          mangaInfo = mangaRequest["data"][chosenMangaIndex]["attributes"]
          sentMessage.delete()
          //console.log(mangaInfo)
          const title = mangaInfo["titles"]["ja_jp"] ? `${mangaInfo["titles"]["ja_jp"]} - ${mangaInfo["canonicalTitle"]}` : mangaInfo["canonicalTitle"]
          const messageEmbed = new MessageEmbed()
            .setColor('#ed7220')
            .setTitle(title)
            .setURL(`https://kitsu.io/anime/${mangaRequest["data"][chosenMangaIndex]["id"]}`)
            .setThumbnail(mangaInfo["posterImage"]["original"])
            .setDescription(mangaInfo["synopsis"])
          Object.keys(checkDict).forEach(function(check) {
            console.log(check)
            if (mangaInfo[check]) {
              messageEmbed.addField(checkDict[check], mangaInfo[check], true)
             }
           })
          if (mangaInfo["nextRelease"]) {
            messageEmbed.setFooter(`Next Release: ${dateFormat(mangaInfo["nextRelease"], "dddd, mmmm dS, yyyy, h:MM TT")}`)
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
 