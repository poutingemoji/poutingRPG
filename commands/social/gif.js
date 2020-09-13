require('dotenv').config()
const { Command } = require('discord.js-commando')



const Tenor = require("tenorjs").client({
    "Key": process.env.TENORKEY,
    "Filter": "low", 
    "Locale": "en_US", 
    "MediaFilter": "basic",
    "DateFormat": "D/MM/YYYY - H:mm:ss A" 
})

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gif',
      aliases: [],
      group: 'social',
      memberName: 'gif',
      description: 'Displays a random gif based on the provided tag or category.',
      examples: [`${process.env.PREFIX}gif [keyword]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: 'gif',
          prompt: "What kind of gif would you like to send?",
          type: 'string',
        },
      ],
      throttling: {
        usages: 1,
        duration: 2
      },
    })
  }
  run(msg, {gif}) { 
    Tenor.Search.Random("anime" + gif, "1").then(Results => {
      Results.forEach(Post => {
        Post.title ? Post.title : "Untitled"
        console.log(`Item ${Post.id} (Created: ${Post.created}) @ ${Post.url}`)
        msg.say(Post.url)
      })
    }).catch(console.error)
  }
}