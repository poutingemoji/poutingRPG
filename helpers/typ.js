const fs = require('fs')
const edata = JSON.parse(fs.readFileSync('./data/emojis.json', 'utf8'))

const funcs = {
    olcb(str) {
        return `\`${str}`
    },
    mlcb(str, syntax) {
        syntax = typeof syntax !== 'undefined' ? syntax : ''
        return "```" + `${syntax}\n${str}` + "```\n"
    },

    emoji(message, emojiId) {
        return message.client.emojis.cache.get(emojiId).toString()
    },
    tcase(str) {
        str = str.replace(/_/g, " ")
        var splitStr = str.toLowerCase().split(' ')
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)     
        }
        return splitStr.join(' ')
    },
    err(message, str, author) {
        author = typeof author !== 'undefined' ? author : false
        return author ? `${funcs.emoji(message, edata.err)} **${message.author.username}**, ${str}` : `${funcs.emoji(message, edata.err)} ${str}`
    }
}

module.exports = funcs