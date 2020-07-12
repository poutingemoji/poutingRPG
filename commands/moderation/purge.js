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
                `${prefix}purge reactions [number] REMOVES ALL REACTIONS RIGHT NOW`,
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
                    key: 'numOfMessages',
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

    run(message, { typeOfMessages, numOfMessages }) {
        counter = 0;
        let messagesDeleted;
        if (!typeOfMessages) {
            message.delete();
            message.channel.bulkDelete(numOfMessages, true).catch(error => {
                console.error(error);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + numOfMessages + "`")
        } else if (["bots", "commands", "embeds", "emojis", "images", "invites", "links", "mentions", "reactions", "text", "startswith", "endswith", "contains", "match"].includes(typeOfMessages) || message.mentions.users.first()) {
            let filteredMessages;
            message.channel.messages.fetch().then(messages => {
                if (typeOfMessages === "reactions") {
                    messages.filter(msg =>  filterLimit(msg, msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error), numOfMessages)));
                } else {
                    if (isNaN(numOfMessages)) {
                        message.delete();
                        let promptKeyword;
                        if (typeOfMessages === "contains") {
                            filteredMessages = messages.filter(msg => msg.content.includes(numOfMessages));
                            promptKeyword = 'containing'
                        } else if (typeOfMessages === "startswith") {
                            filteredMessages = messages.filter(msg => msg.content.startsWith(numOfMessages));
                            promptKeyword = 'starting with'
                        } else if (typeOfMessages === "endswith") {
                            filteredMessages = messages.filter(msg => msg.content.endsWith(numOfMessages));
                            promptKeyword = 'ending with'
                        } else if (typeOfMessages === "match") {
                            filteredMessages = messages.filter(msg => msg.content === numOfMessages);
                            promptKeyword = 'matching'
                        }
                        messagesDeleted = filteredMessages.array(); 
                        console.log(typeOfMessages)
                        message.channel.bulkDelete(messagesDeleted, true).catch(error => {
                            console.error(error);
                        });
                        if (messagesDeleted.length > 0) {
                            purgeMessage(message, `Deletion of messages ${promptKeyword} **${numOfMessages}** was successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                        } else
                            purgeMessage(message, `No messages ${promptKeyword} **${numOfMessages}** could be found!`)
                    } else {
                        if (typeOfMessages <= 0 || typeOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
                        message.delete();
                        const user = message.mentions.users.first()
                        if (user) {                         
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.author.id === user.id, numOfMessages));
                        } else if (typeOfMessages === "bots") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.author.bot, numOfMessages));
                        } else if (typeOfMessages === "commands") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.startsWith(message.guild.commandPrefix), numOfMessages));
                        } else if (typeOfMessages === "embeds") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.embeds.length, numOfMessages));
                        } else if (typeOfMessages === "emojis") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('<:' && '>' || '<a:' && '>') || isDoubleByte(msg.content), numOfMessages));
                        } else if (typeOfMessages === "images") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.attachments.size > 0, numOfMessages));
                        } else if (typeOfMessages === "invites") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('discord.gg/'||'discordapp.com/invite/'), numOfMessages));
                        } else if (typeOfMessages === "links") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.content.includes('https://'||'www.'||'.com'), numOfMessages));
                        } else if (typeOfMessages === "mentions") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, msg.mentions.users.first() || msg.mentions.roles.first(), numOfMessages));
                        } else if (typeOfMessages === "text") {
                            filteredMessages = messages.filter(msg => filterLimit(msg, !(msg.attachments.size > 0) && !msg.embeds.length), numOfMessages);
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
                }
            }).catch(error => {
                console.log(error);
            });
        } else if (!isNaN(typeOfMessages)) {
            if (typeOfMessages <= 0 || typeOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
            message.delete();
            message.channel.bulkDelete(typeOfMessages, true).catch(error => {
                console.error(error);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + typeOfMessages + "`")
        };
    };
};

function filterLimit(msg, condition, numOfMessages) {
    if (counter < numOfMessages && condition) {
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

