const edata = require('../docs/data/emojis.js')
const { MessageEmbed } = require('discord.js')

class Helper {
  codeBlock(str, syntax) {
    syntax = typeof syntax !== 'undefined' ? syntax : '';
    return `\`\`\`${syntax}\n${str}\n\`\`\`\n`;
  };

  emoji(message, emojiId) {
    return message.client.emojis.cache.get(emojiId).toString();
  };

  titleCase(str) {
    str = String(str)
    str = str.replace(/_/g, " ");
    var splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  emojiMsg(message, align, emoji, str, author) {
    author = typeof author !== 'undefined' ? author : false;
    let content = '';
    if (align == "left") {
      for (let i = 0; i < emoji.length; i++) {
        content += this.emoji(message, edata[emoji[i]]);
      }
      author ? content += ` **${message.author.username}**,` : content += '';
      return content + ` ${str}`;
    } else if (align == "center") {
      author ? content += ` **${message.author.username}**,` : content += '';
      content += `${str} `;
      for (let i = 0; i < emoji.length; i++) {
        if (i % 2 == 0) {
          content = this.emoji(message, edata[emoji[i]]) + content;
        } else {
          content += this.emoji(message, edata[emoji[i]]);
        }
      }
      return content;
    };
  };

  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  };

  secondsToDhms(seconds, conjunction, abbreviate, splice) {
    seconds = parseInt(seconds);
    
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var Display = [
      d > 0 ? d + (abbreviate ? "d" : (d == 1 ? " day" : " days")) : false, 
      h > 0 ? h + (abbreviate ? "h" : (h == 1 ? " hour" : " hours")) : false, 
      m > 0 ? m + (abbreviate ? "m" : (m == 1 ? " minute" : " minutes")) : false, 
      s > 0 ? s + (abbreviate ? "s" : (s == 1 ? " second" : " seconds")) : false
    ]
    if (splice) Display.splice(-1,splice)
    return Display.filter(Boolean).join(conjunction);
  };

  randomIntFromInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  romanize(num) {
    if (isNaN(num))
      return NaN;
    var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

  arrayShuffle(array) {
    for ( var i = 0, length = array.length, swap = 0, temp = ''; i < length; i++ ) {
      swap = Math.floor(Math.random() * (i + 1));
      temp = array[swap];
      array[swap] = array[i];
      array[i] = temp;
    }
    return array;
  };
 
  percentageChance(values, chances) {
    for ( var i = 0, pool = []; i < chances.length; i++ ) {
      for ( var i2 = 0; i2 < chances[i]; i2++ ) {
        pool.push(i);
      }
    }
    return values[arrayShuffle(pool)['0']];
  };
}

module.exports = new Helper();

