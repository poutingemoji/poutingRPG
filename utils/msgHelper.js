const { MessageEmbed } = require('discord.js')

const { titleCase, secondsToDhms } = require('./Helper')
const { embedColors } = require('./enumHelper')

const emojis = require('../docs/data/emojis.js')

const Pagination = require('discord-paginationembed');

const msgHelper = {
  
  emoji(msg, emoji) {
    return msg.client.emojis.cache.get(emojis[emoji]).toString();
  },
  
  confirmation(msg, content) {
    return msg.say(content).then(msgSent => {
      msgSent.react(emojis['check'])
      .then(() => msgSent.react(emojis['cross']))

      const filter = (reaction, user) => {
        return ['check', 'cross'].includes(reaction.emoji.name) && user.id === msg.author.id;
      }

      return msgSent.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          msgSent.delete();
          if (collected.first().emoji.name == 'check') return true
          else return false
        })
        .catch(() => msgSent.delete());
    })
  },

  async commandInfo(msg, command) {
    const messageEmbed = new MessageEmbed()
      .setColor(embedColors.bot)
      .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL())
      .setTitle(`${titleCase(command.groupID)} Command: ${command.name}`)
      .setURL('https://poutingemoji.github.io/poutingbot/commands.html')
      .setDescription(`**Description**: ${command.description}`)
      .setFooter([command.guildOnly ? 'Usable only in servers' : false, command.nsfw ? 'NSFW' : false].filter(Boolean).join(', '))
    if(command.examples.length > 0) messageEmbed.addField('Usage:', command.examples.join('\n'));
    if(command.aliases.length > 0) messageEmbed.addField('Aliases:', command.aliases.join(', '));
    messageEmbed.addField('Cooldown:', secondsToDhms(command.throttling.duration, ', '))
    msg.say(messageEmbed) 
  },

  async buildEmbeds(msg, embeds, footer) {
    const Embeds = new Pagination.Embeds()
    .setArray(embeds)
    .setAuthorizedUsers([msg.author.id])
    .setChannel(msg.channel)
    .setClientAssets({ msg, prompt: '{{user}}, which page would you like to see?' })
    .setNavigationEmojis({
      back: '⬅️',
      delete: emojis.cross,
      forward: '➡️',
      jump: '🔢',
    })
    .setDisabledNavigationEmojis(['delete'])
    .setColor(embedColors.game)
    if (footer) Embeds.setFooter(footer)
    await Embeds.build();
  },

}

module.exports = msgHelper

