const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");
let counter;
module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ['prune', 'clear', 'wipe'],
            group: 'moderation',
            memberName: 'purge',
            description: 'Allows you to mass delete messages in your server. DEFAULT: 25 MSGS',
            examples: [
                `${prefix}purge @user`,
                `${prefix}purge [number]`,
                `${prefix}purge bots [number]`,
                `${prefix}purge commands [number]`,
                `${prefix}purge mentions [number]`,
                `${prefix}purge images [number]`,
                `${prefix}purge links [number]`,
                `${prefix}purge invites [number]`,
                `${prefix}purge text [number]`,
                `${prefix}purge embeds [number]`,
                `${prefix}purge emojis [number]`,
                `${prefix}purge startswith [content]`,
                `${prefix}purge endswith [content]`,
                `${prefix}purge includes [content]`,
                `${prefix}purge match [content]`,
            ],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'typeOfMessages',
                    prompt: 'What kind of message would you like to purge?',
                    type: 'string',
                    default: false,
                },
                {
                    key: 'messageFilter',
                    prompt: 'How many messages would you like to purge?',
                    type: 'string',
                    default: 25,
                },
            ],
            throttling: {
                usages: 1,
                duration: 10
            },
        });    
    }

    run(message, { typeOfMessages, messageFilter }) {
        counter = 0;
        let messagesDeleted;
        message.delete();
        if (!isNaN(messageFilter)) {
            messageFilter = Math.floor(messageFilter)
        }
        if (!typeOfMessages) {
            message.channel.bulkDelete(messageFilter, true).catch(error => {
                console.error(error);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + messageFilter + "`")
        } else if (["bots", "commands", "embeds", "emojis", "images", "invites", "links", "mentions", "text", "startswith", "endswith", "contains", "match"].includes(typeOfMessages) || message.mentions.users.first()) {
            let filteredMessages;
            message.channel.messages.fetch().then(messages => {
                if (isNaN(messageFilter)) {
                    let promptKeyword;
                    if (typeOfMessages === "contains") {
                        filteredMessages = messages.filter(msg => msg.content.includes(messageFilter));
                        promptKeyword = 'containing'
                    } else if (typeOfMessages === "startswith") {
                        filteredMessages = messages.filter(msg => msg.content.startsWith(messageFilter));
                        promptKeyword = 'starting with'
                    } else if (typeOfMessages === "endswith") {
                        filteredMessages = messages.filter(msg => msg.content.endsWith(messageFilter));
                        promptKeyword = 'ending with'
                    } else if (typeOfMessages === "match") {
                        filteredMessages = messages.filter(msg => msg.content === messageFilter);
                        promptKeyword = 'matching'
                    }
                    messagesDeleted = filteredMessages.array(); 
                    console.log(typeOfMessages)
                    message.channel.bulkDelete(messagesDeleted, true).catch(error => {
                        console.error(error);
                    });
                    if (messagesDeleted.length > 0) {
                        purgeMessage(message, `Deletion of messages ${promptKeyword} **${messageFilter}** was successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                    } else
                        purgeMessage(message, `No messages ${promptKeyword} **${messageFilter}** could be found!`)
                } else {
                    if (typeOfMessages <= 0 || typeOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
                    const user = message.mentions.users.first()
                    if (user) {                         
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.author.id === user.id, messageFilter));
                    } else if (typeOfMessages === "bots") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.author.bot, messageFilter));
                    } else if (typeOfMessages === "commands") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.startsWith(message.guild.commandPrefix), messageFilter));
                    } else if (typeOfMessages === "embeds") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.embeds.length, messageFilter));
                    } else if (typeOfMessages === "emojis") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('<:' && '>' || '<a:' && '>') || isDoubleByte(msg.content), messageFilter));
                    } else if (typeOfMessages === "images") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.attachments.size > 0, messageFilter));
                    } else if (typeOfMessages === "invites") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('discord.gg/'||'discordapp.com/invite/'), messageFilter));
                    } else if (typeOfMessages === "links") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('https://'||'www.'||'.com'), messageFilter));
                    } else if (typeOfMessages === "mentions") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, msg.mentions.users.first() || msg.mentions.roles.first(), messageFilter));
                    } else if (typeOfMessages === "text") {
                        filteredMessages = messages.filter(msg => filterLimit(msg, !(msg.attachments.size > 0) && !msg.embeds.length), messageFilter);
                    }
                    messagesDeleted = filteredMessages.array(); 

                    message.channel.bulkDelete(messagesDeleted, true).catch(error => {
                        console.error(error);
                    });

                    if (!user) {
                        if (messagesDeleted.length > 0) {
                            purgeMessage(message, `Deletion of **${typeOfMessages}** successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                        } else
                            purgeMessage(message, `No **${typeOfMessages}** were found!`)
                    } else {
                        if (messagesDeleted.length > 0) {
                            purgeMessage(message, `Deletion of **${user.username}**'s messages was successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                        } else
                            purgeMessage(message, `None of **${user.username}** 's messages were found!`)
                    }
                }
            }).catch(error => {
                console.log(error);
            });
        } else if (!isNaN(typeOfMessages)) {
            if (typeOfMessages <= 0 || typeOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
            message.channel.bulkDelete(typeOfMessages, true).catch(error => {
                console.error(error);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + typeOfMessages + "`")
        };
    };
};

function filterLimit(msg, condition, messageFilter) {
    if (counter < messageFilter && condition) {
        counter++;
        return true
    } else {
        return false
    }
};

function isDoubleByte(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 255) { return true; }
    }
    return false;
}

async function purgeMessage(message, text) {
    try {
        const sentMessage = await message.say(text);
            setTimeout(function(){
                sentMessage.delete()
            }, 1500);
    } catch(error) {
        console.log(error)
        return console.log("Didn't edit the message.");
    };
};

