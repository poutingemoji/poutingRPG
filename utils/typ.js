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
  titleCase(str) {
  str = str.replace(/_/g, " ")
  var splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)   
  }
  return splitStr.join(' ')
  },
  emojiMsg(message, align, emoji, str, author) {
  author = typeof author !== 'undefined' ? author : false
  let content = ''
  if (align == "left") {
    for (let i = 0; i < emoji.length; i++) {
    content += funcs.emoji(message, edata[emoji[i]])
    }
    author ? content += ` **${message.author.username}**,` : content += ''
    return content + ` ${str}`
  } else if (align == "center") {
    author ? content += ` **${message.author.username}**,` : content += ''
    content += `${str} `
    for (let i = 0; i < emoji.length; i++) {
    if (i % 2 == 0) {
      content = funcs.emoji(message, edata[emoji[i]]) + content
    } else {
      content += funcs.emoji(message, edata[emoji[i]])
    }
    }
    return content
  }
  }
}

module.exports = funcs