require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { disambiguation, titleCase, secondsToDhms } = require('../../utils/Helper');
const { links, embedColors } = require('../../utils/enumHelper');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands'],
			group: 'info',
			memberName: 'help',
      description: "Shows the command list.",
      examples: [`${process.env.PREFIX}help`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: false,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }
  async run(msg, args) {
		const commands = this.client.registry.findCommands(args.command, false, msg);
    const showAll = args.command && args.command.toLowerCase() === 'all';
    if(args.command && !showAll) {
			if(commands.length === 1) {
        const messageEmbed = new MessageEmbed()
          .setColor(embedColors.bot)
          .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL())
          .setTitle(`${titleCase(commands[0].groupID)} Command: ${commands[0].name}`)
          .setURL('https://poutingemoji.github.io/poutingbot/commands.html')
          .setDescription(`**Description**: ${commands[0].description}`)
          .setFooter([commands[0].guildOnly ? 'Usable only in servers' : false, commands[0].nsfw ? 'NSFW' : false].filter(Boolean).join(', '))
        if(commands[0].examples.length > 0) messageEmbed.addField('Usage:', commands[0].examples.join('\n'));
        if(commands[0].aliases.length > 0) messageEmbed.addField('Aliases:', commands[0].aliases.join(', '));
        messageEmbed.addField('Cooldown:', secondsToDhms(commands[0].throttling.duration, ', '))

        const messages = [];
        
				try {
					messages.push(await msg.say(messageEmbed));
				} catch(err) {
					messages.push(await msg.reply('Unable to send you the command info.'));
        }
        
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Multiple commands found. Please be more specific.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`
				);
			}
		} else {
			const messages = [];
			try {
        const commandPrefix = msg.guild ? msg.guild.commandPrefix : msg.client.commandPrefix
        const messageEmbed = new MessageEmbed()
          .setColor(embedColors.bot)
          .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL())
          .addFields(
            { name: 'Commands', value: 'You can view a full list of the commands here: https://poutingemoji.github.io/poutingbot/commands.html' },
            { name: 'Prefix', 
              value: `
              Current prefix of ${msg.guild ? `__**${msg.guild}**__` : 'this DM'} is \`${commandPrefix}\`
              To use a command, write the prefix followed by the command name. 
              Example: \`${commandPrefix}help\`
            ` },
            { name: 'More Command Info', 
            value: `
              To get more information on a specific command, use \`${commandPrefix}help [command]\`
              Example: \`${commandPrefix}help start\`
            ` },
            { name: 'Useful Links', 
              value: `
              **Command List**: ${links.commandList}
              **Website**: ${links.website}
              **Support Server**: ${links.supportServer}
            ` },
          )
				messages.push(await msg.say(messageEmbed));
			} catch(err) {
        console.log(err)
				messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
			}
			return messages;
		}
  }
}
