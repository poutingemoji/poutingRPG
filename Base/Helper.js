//BASE
const seedrandom = require("seedrandom");
const RNG = seedrandom();

//DATA

//UTILS
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
   * @returns {Number} randomNumber
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
   * Returns a random value from an array
   * @param value
   * @param {Number} length
   * @param {Array} array
   * @returns Value
   */
  fillArray(value, len, arr = []) {
    for (let i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  }

  /*
    GENERAL HELPERS
  */

  /**
   * Returns a number with commas
   * @param {Number} int
   * @returns {Number}
   */
  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Returns a number within a min and max
   * @param {Number} int
   * @param {Number} min
   * @param {Number} max
   * @returns {Number} clampedNumber
   */
  clamp(int, min, max) {
    return int <= min ? min : int >= max ? max : int;
  }

  /**
   * Returns a boolean if a number is within a min and max
   * @param {Number} int
   * @param {Number} min
   * @param {Number} max
   * @returns {Number}
   */
  isBetween(int, min, max) {
    return (int - min) * (int - max) <= 0;
  }

  /**
   * Returns a Roman numeral
   * @param {Number} int
   * @returns {String} Roman numeral
   */
  romanize(int) {
    if (isNaN(int)) return NaN;
    //prettier-ignore
    let digits = String(+int).split(""),
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
   * @returns {String} timeFormat
   */
  secondsToTimeFormat(seconds, conjunction = " and ", abbreviate = true) {
    seconds = parseInt(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let Display = [
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

  /**
   * Returns a codeblock for Discord
   * @param {String} message
   * @param {String} syntax
   * @returns {String} codeblock
   */
  setImportantMessage(message, syntax = "") {
    return `\`\`\`${syntax}\n${message}\`\`\``;
  }

  /**
   * Capitalizes first letter of every word in a string
   * @param {String} str
   * @returns {String} capitalizedString
   */
  titleCase(str) {
    str = str.toLowerCase().split(" ");
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  }

  /**
   * Converts snake_case to camelCase
   * Utilizes https://hisk.io/javascript-snake-to-camel/
   * @param {String} str
   * @returns {String} camelCase
   */
  snakeToCamelCase(str) {
    return str.replace(
      /([-_][a-z])/g,
      (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
  }

  /**
   * Converts camelCase to snake_case
   * Utilizes https://stackoverflow.com/a/54246501
   * @param {String} str
   * @returns {String} snakeCase
   */
  camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  } 

  /**
   * Verifies if object contains name of nameToCheck
   * @param {Object} obj
   * @param {String} nameToCheck
   * @returns {Boolean} containsName
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

  /**
   * Returns a string of the object's properties
   * @param {Object} obj
   * @returns {String}
   */
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
   * @returns {Object} filteredObject
   */
  filterObject(raw, filter) {
    return Object.keys(raw)
      .filter(filter)
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});
  }

  /**
   * Returns formatted string of time passed since timeStamp
   * @param {Date} timeStamp
   * @returns String
   */
  getTimePassed(timeStamp) {
    return (new Date().getTime() - timeStamp) / 1000;
  }
}

module.exports = Helper;
