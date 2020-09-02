require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const Helper = require('../../utils/Helper')
const Database = require('../../database/Database');

const positions = require('../../docs/data/positions.js')

const fs = require('fs');

module.exports = class PagesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pages',
			aliases: [],
			group: 'game',
			memberName: 'pages',
			description: 'Page test.',
			examples: [`${process.env.PREFIX}pages`],
			clientPermissions: [],
			userPermissions: [],
			guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 4
      },
    })
	}
	
	run(message) {

    let pages = ['Page 1', 'two', 'tres', 'si', 'wu', 'seis', 'seven'];
    let page = 1;

    const messageEmbed = new MessageEmbed()
    .setColor('#2f3136')
    .setTitle(`React to cycle`)
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page-1])

    message.say(messageEmbed).then(msg => {
      msg.react('⬅️').then(r => {
        msg.react('➡️')
        const filter = (reaction, user) => {
          return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
        }
        const reactionCollector = msg.createReactionCollector(filter, {time: 60000});
        reactionCollector.on('collect', async r => {
          if (r.emoji.name == '⬅️') {
            page == 1 ? page = pages.length : page--
          } else if (r.emoji.name == '➡️'){
            page == pages.length ? page = 1 : page++
          } else {

          }
          
          messageEmbed.setDescription(pages[page-1]);
          messageEmbed.setFooter(`Page ${page} of ${pages.length}`)
          msg.edit(messageEmbed)

          const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
          try {
            for (const reaction of userReactions.values()) {
              await reaction.users.remove(message.author.id);
            }
          } catch (error) {
            console.error(error);
          }
        })
      })
    })
  }
}