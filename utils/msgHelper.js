const { MessageEmbed } = require('discord.js')

const { embedColors } = require('./enumHelper')

const emojis = require('../docs/data/emojis.js')

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

      return msgSent.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
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
      .setTitle(`${Helper.titleCase(command.groupID)} Command: ${command.name}`)
      .setURL('https://poutingemoji.github.io/poutingbot/commands.html')
      .setDescription(`**Description**: ${command.description}`)
      .setFooter([command.guildOnly ? 'Usable only in servers' : false, command.nsfw ? 'NSFW' : false].filter(Boolean).join(', '))
    if(command.examples.length > 0) messageEmbed.addField('Usage:', command.examples.join('\n'));
    if(command.aliases.length > 0) messageEmbed.addField('Aliases:', command.aliases.join(', '));
    messageEmbed.addField('Cooldown:', Helper.secondsToDhms(command.throttling.duration, ', '))
    const messages = [];
    try {
      messages.push(await msg.say(messageEmbed));
    } catch(err) {
      messages.push(await msg.reply('Unable to send you the command info.'));
    }
    return messages;
  },

}

module.exports = msgHelper

