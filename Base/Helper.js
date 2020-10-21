//BASE
const fs = require("fs");
const seedrandom = require("seedrandom");
const RNG = seedrandom();

//DATA
const enumHelper = require("../utils/enumHelper");

class Helper {
  /*
    GAME HELPERS
  */

  /**
   * Returns a random number between a min and max
   * Utilizing https://stackoverflow.com/questions/15594332/unbiased-random-range-generator-in-javascript
   * @param {Number} min
   * @param {Number} max
   * @param {Number} decimal
   * @param {Number} exclude
   * @returns {Number}
   */
  randomBetween(min, max, decimal, exclude) {
    // Adding + 1 to max due to trunc
    max += 1;
    if (arguments.length < 2) return RNG() >= 0.5;

    let factor = 1;
    let result;
    if (typeof decimal === "number") {
      factor = decimal ** 10;
    }
    do {
      result = RNG() * (max - min) + min;
      result = Math.trunc(result * factor) / factor;
    } while (result === exclude);
    return result;
  }

  /**
   * Returns a random value from an array
   * @param {Array} array
   * @returns Value
   */
  randomChoice(array) {
    return array[this.randomBetween(0, array.length - 1)];
  }

  /**
   * Returns sum of players strength
   * @param {Object} player
   * @returns Number
   */
  sumPlayerTotalStrength(player) {
    return player.stats.str + player.equipment.relic.str;
  }

  /*
    GENERAL HELPERS
  */

  /**
   * Returns a number with commas
   * @param {Number} int
   * @returns Number
   */
  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  clamp(int, min, max) {
    return int <= min ? min : int >= max ? max : int;
  }

  isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
  }

  romanize(num) {
    if (isNaN(num)) return NaN;
    //prettier-ignore
    let digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  /**
   * Converts seconds to time format
   * Utilizes https://stackoverflow.com/a/52387803
   * @param {Number} seconds
   * @param {String} conjunction
   * @param {Boolean} abbreviate
   * @returns {String}
   */

  secondsToTimeFormat(seconds, conjunction = " and ", abbreviate = true) {
    seconds = parseInt(seconds);

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var Display = [
      d > 0 ? d + (abbreviate ? "d" : d == 1 ? " day" : " days") : false,
      h > 0 ? h + (abbreviate ? "h" : h == 1 ? " hour" : " hours") : false,
      m > 0 ? m + (abbreviate ? "m" : m == 1 ? " minute" : " minutes") : false,
      s > 0 ? s + (abbreviate ? "s" : s == 1 ? " second" : " seconds") : false,
    ];

    Display = Display.filter(Boolean);
    if (abbreviate) {
      Display.length = Math.min(Display.length, 2);
    }
    return Display.join(conjunction);
  }

  //STRING
  /**
   * Returns a codeblock for Discord
   * @param {String} message
   * @returns {String} codeblock
   */
  setImportantMessage(message) {
    return `\`\`\`css\n${message}\`\`\``;
  }

  /**
   * Capitalizes first letter of every word in a string
   * @param {String} str
   * @returns {String}
   */
  titleCase(str) {
    str = str.toLowerCase().split(" ");
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  }

  //OBJECT
  /**
   * Verifies if object contains name of nameToCheck
   * @param {Object} obj
   * @param {String} nameToCheck
   * @returns {Boolean}
   */
  objectContainsName(obj, nameToCheck) {
    if (typeof obj !== "object") {
      throw new Error("obj provided is not an Object!");
    }
    if (typeof nameToCheck !== "string") {
      throw new Error("nameToCheck provided is not a String!");
    }

    const keyList = Object.keys(obj);
    for (let i = 0; i < keyList.length; i++) {
      if (!keyList.includes("name") && typeof obj[keyList[i]] === "object") {
        if (this.objectContainsName(obj[keyList[i]], nameToCheck)) {
          return true;
        }
      } else if (obj[keyList[i]] && obj[keyList[i]] === nameToCheck) {
        return true;
      }
    }

    return false;
  }
  
  objectToString(obj) {
    let string = "";
    for (const prop in obj) {
      string +=
        obj[prop].length == 0 ? `${prop}\n` : `**${prop}**: ${obj[prop]}\n`;
    }
    return string;
  }

  /**
   * Returns a shallow copy of the object only with filtered properties.
   * Utilizes https://stackoverflow.com/a/38750895
   * @param {Object} raw
   * @param {Function} filter
   * @returns {Object}
   */

  filterObject(raw, filter) {
    return Object.keys(raw)
    .filter(filter)
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
  }
  //ARRAY
  arrayShuffle(array) {
    for (
      var i = 0, length = array.length, swap = 0, temp = "";
      i < length;
      i++
    ) {
      swap = Math.floor(Math.random() * (i + 1));
      temp = array[swap];
      array[swap] = array[i];
      array[i] = temp;
    }
    return array;
  }

  percentageChance(values, chances) {
    for (var i = 0, pool = []; i < chances.length; i++) {
      for (var i2 = 0; i2 < chances[i]; i2++) {
        pool.push(i);
      }
    }
    console.log(pool.length);
    return values[this.arrayShuffle(pool)[0]];
  }

  //DATE
  /**
   * Returns formatted string of time passed since timeStamp
   * @param {Date} timeStamp
   * @returns String
   */
  getTimePassed(timeStamp) {
    return this.secondsToTimeFormat((new Date().getTime() - timeStamp) / 1000);
  }
}

module.exports = Helper;
