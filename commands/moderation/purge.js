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
                `${prefix}purge reactions [number]`,
                `${prefix}purge startswith [content]`,
                `${prefix}purge endswith [content]`,
                `${prefix}purge includes [content]`,
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
                    type: 'integer',
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
        if (numOfMessages <= 0 || numOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
        counter = 0;
        let messagesDeleted;
        if (!typeOfMessages) {
            message.delete();
            message.channel.bulkDelete(numOfMessages, true).catch(err => {
                console.error(err);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + numOfMessages + "`")
        } else if (!isNaN(typeOfMessages)) {
            if (typeOfMessages <= 0 || typeOfMessages > 100) return purgeMessage(message, "Number of messages deleted must be greater than 0 and less than 101.");
            message.delete();
            message.channel.bulkDelete(typeOfMessages, true).catch(err => {
                console.error(err);
            });
            purgeMessage(message, "Deletion of messages successful. Total messages deleted: " + "`" + typeOfMessages + "`")
        } else if (["startswith", "endswith", "includes"].includes(typeOfMessages)) {
            if (typeOfMessages === "includes") {

            }
        } else if (["bots", "commands", "embeds", "emojis", "images", "invites", "links", "mentions", "reactions", "text"].includes(typeOfMessages) || message.mentions.users.first()) {
            message.delete();
            let filteredMessages;
            message.channel.messages.fetch().then(messages => {
                if (typeOfMessages !== "reactions") {
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
                        };
                        messagesDeleted = filteredMessages.array(); 
                        if (!user) {
                            if (messagesDeleted.length > 0) {
                                message.channel.bulkDelete(messagesDeleted);
                                purgeMessage(message, `Deletion of **${typeOfMessages}** successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                            } else
                                purgeMessage(message, `No **${typeOfMessages}** were found!`)
                        } else {
                            if (messagesDeleted.length > 0) {
                                message.channel.bulkDelete(messagesDeleted);
                                purgeMessage(message, `Deletion of **${user.username}**'s messages was successful. Total messages deleted: ` + "`" + messagesDeleted.length + "`")
                            } else
                                purgeMessage(message, `None of **${user.username}** 's messages were found!`)
                        }
                } else {
                    messages.filter(msg =>  msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)));
                }
            }).catch(err => {
                console.log(err);
            });
        };
    };
};

function filterLimit(msg, condition, numOfMessages) {
    console.log("msg " + msg.content)
    if (counter < numOfMessages && condition) {
        counter++;
        console.log("counter: " + counter, "numofmessages: " + numOfMessages)
        console.log("true")
        return true
    } else {
        console.log("counter: " + counter, "numofmessages: " + numOfMessages)
        console.log("false")
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
    } catch(err) {
        console.log(err)
        return console.log("Didn't edit the message.");
    };
};

