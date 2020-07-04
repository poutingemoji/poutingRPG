const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ['purge', 'prune', 'clear', 'wipe'],
            group: 'moderation',
            memberName: 'purge',
            description: 'Allows you to mass delete messages in your server. DEFAULT: 100 MSGS',
            examples: [`${prefix}purge @user\n${prefix}purge [number]\n${prefix}purge bots [number]\n${prefix}purge bots [number]\n${prefix}purge bots [number]\n${prefix}purge bots [number]\n${prefix}purge endswith [content]\n${prefix}purge images [number]\n${prefix}purge invites [number]\n${prefix}purge links [number]\n${prefix}purge match [content]\n${prefix}purge mentions [number]\n${prefix}purge reactions [number]\n${prefix}purge startswith [content]\n${prefix}purge text [number]\n`],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'typeOfPurge',
                    prompt: 'What kind of message would you like to purge?',
                    type: 'string',
                    default: false,
                },
                {
                    key: 'numOfMessages',
                    prompt: 'How many messages would you like to purge?',
                    type: 'integer',
                    default: 100,
                },
            ],
            throttling: {
                usages: 1,
                duration: 5
            },
        });    
    }

    run(message, { typeOfPurge, numOfMessages }) {
        let messagesDeleted;
        if (!typeOfPurge) {
            message.delete();
            message.channel.bulkDelete(numOfMessages, true).catch(err => {
                console.error(err);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + numOfMessages + "`")
        } else if (!isNaN(typeOfPurge)) {
            message.delete();
            message.channel.bulkDelete(typeOfPurge, true).catch(err => {
                console.error(err);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + typeOfPurge + "`")
        } else if (["bots", "commands", "embeds", "emojis", "images", "invites", "links", "mentions", "reactions", "text"].includes(typeOfPurge)) {
            message.delete();
            let filteredMessages;
            message.channel.messages.fetch({ limit: numOfMessages }).then(messages => {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    filteredMessages = messages.filter(msg => msg.author.id === user.id);
                } else {
                    if (typeOfPurge === "bots") {
                        filteredMessages = messages.filter(msg => msg.author.bot);
                    } else if (typeOfPurge === "commands") {
                        filteredMessages = messages.filter(msg => msg.content.startsWith(message.guild.commandPrefix));
                    } else if (typeOfPurge === "embeds") {
                        filteredMessages = messages.filter(msg => !!msg.embeds.length);
                    } else if (typeOfPurge === "emojis") {
                        filteredMessages = messages.filter(msg => msg.embeds);
                    } else if (typeOfPurge === "images") {
                        filteredMessages = messages.filter(msg => msg.attachments.size > 0);
                    } else if (typeOfPurge === "invites") {
                        filteredMessages = messages.filter(msg => msg.content.includes('discord.gg/'||'discordapp.com/invite/'));
                    } else if (typeOfPurge === "links") {
                        filteredMessages = messages.filter(msg => msg.content.includes('https://'||'www.'||'.com'));
                    } else if (typeOfPurge === "mentions") {
                        filteredMessages = messages.filter(msg => msg.mentions.users.first() || msg.mentions.roles.first());
                    } else if (typeOfPurge === "reactions") {
                        filteredMessages = messages.filter(msg => msg.content.includes('discord.gg/'||'discordapp.com/invite/'));
                    } else if (typeOfPurge === "text") {
                        filteredMessages = messages.filter(msg => !(msg.attachments.size > 0));
                    }
                };
                messagesDeleted = filteredMessages.array(); 
                message.channel.bulkDelete(messagesDeleted);
                purgeMessage(message, `Deletion of **${typeOfPurge}** successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
            }).catch(err => {
                console.log(err);
            });
        };
    };
};

async function purgeMessage(message, text) {
    try {
        const sentMessage = await  message.say(text);
            setTimeout(function(){
                sentMessage.delete()
            }, 3000);
    } catch(err) {
        console.log(err)
        return console.log("Didn't edit the message.");
    };
};