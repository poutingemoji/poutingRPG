//http://patorjk.com/software/taag/#p=testall&f=Modular
class Helper {
  /*
   ___   __    _  _______  _______  _______  _______  ______   
  |   | |  |  | ||       ||       ||       ||       ||    _ |  
  |   | |   |_| ||_     _||    ___||    ___||    ___||   | ||  
  |   | |       |  |   |  |   |___ |   | __ |   |___ |   |_||_ 
  |   | |  _    |  |   |  |    ___||   ||  ||    ___||    __  |
  |   | | | |   |  |   |  |   |___ |   |_| ||   |___ |   |  | |
  |___| |_|  |__|  |___|  |_______||_______||_______||___|  |_|
  */

  /**
   * Returns a number within a min and max
   * @param {Number} int
   * @param {Number} min
   * @param {Number} max
   * @returns {Number} Clamped number
   */
  clamp(int, min, max) {
    return int <= min ? min : int >= max ? max : int;
  }

  /**
   * Returns a boolean if a number is within a min and max
   * @param {Number} int
   * @param {Number} min
   * @param {Number} max
   * @returns {Boolean} Is between
   */
  isBetween(int, min, max) {
    return (int - min) * (int - max) <= 0;
  }

  /**
   * Returns a number with commas
   * @param {Number} int
   * @returns {Number} Number with commas
   */
  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /*
   _______  _______  ______    ___   __    _  _______ 
  |       ||       ||    _ |  |   | |  |  | ||       |
  |  _____||_     _||   | ||  |   | |   |_| ||    ___|
  | |_____   |   |  |   |_||_ |   | |       ||   | __ 
  |_____  |  |   |  |    __  ||   | |  _    ||   ||  |
   _____| |  |   |  |   |  | ||   | | | |   ||   |_| |
  |_______|  |___|  |___|  |_||___| |_|  |__||_______|
  */

  /**
   * Removes emojis from a string
   * Utilizes https://stackoverflow.com/a/61783246
   * @param {String} text
   * @returns {String} String without emojis
   */
  containsOnlyEmojis(text) {
    const onlyEmojis = text.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
    return onlyEmojis;
    /*
      const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
      return onlyEmojis.length === visibleChars.length
    */
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

  /*
     _______  ______    ______    _______  __   __ 
    |   _   ||    _ |  |    _ |  |   _   ||  | |  |
    |  |_|  ||   | ||  |   | ||  |  |_|  ||  |_|  |
    |       ||   |_||_ |   |_||_ |       ||       |
    |       ||    __  ||    __  ||       ||_     _|
    |   _   ||   |  | ||   |  | ||   _   |  |   |  
    |__| |__||___|  |_||___|  |_||__| |__|  |___|  
  */

  /**
   * Fills the given array with the given value x times.
   * @param value
   * @param {Number} length
   * @param {Array} arr
   * @returns Value
   */
  fillArray(value, length, arr = []) {
    for (let i = 0; i < length; i++) {
      arr.push(value);
    }
    return arr;
  }

  /*
     _______  _______      ___  _______  _______  _______ 
    |       ||  _    |    |   ||       ||       ||       |
    |   _   || |_|   |    |   ||    ___||       ||_     _|
    |  | |  ||       |    |   ||   |___ |       |  |   |  
    |  |_|  ||  _   |  ___|   ||    ___||      _|  |   |  
    |       || |_|   ||       ||   |___ |     |_   |   |  
    |_______||_______||_______||_______||_______|  |___|  
  */

  /**
   * Returns a shallow copy of the object only with filtered properties.
   * Utilizes https://stackoverflow.com/a/38750895
   * @param {Object} raw
   * @param {Function} filter
   * @returns {Object} Filtered object
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
   * Groups values of an array into categories and returns as an object
   * @param {Array} arr
   * @param {Function} fn
   * @returns {Object} Grouped array
   */
  groupBy(arr, fn) {
    return arr.reduce((result, item) => {
      const key = fn(item);
      if (!result[key]) result[key] = [];
      result[key].push(item);
      console.log(result);
      return result;
    }, {});
  }

  /**
   * Recursively checks the object for a property
   * @param {Object} obj
   * @param {String} prop
   * @returns {Boolean} Object has property
   */
  hasOwnDeepProperty(obj, prop) {
    if (typeof obj === 'object' && obj !== null) { 
      if (obj.hasOwnProperty(prop)) {            
        return true;
      }
      for (let p in obj) {                       
        if (obj.hasOwnProperty(p) &&               
            hasOwnDeepProperty(obj[p], prop)) { 
          return true;
        }
      }
    }
    return false;                                  
  }

  /*
     ______    _______  __    _  ______   _______  __   __ 
    |    _ |  |   _   ||  |  | ||      | |       ||  |_|  |
    |   | ||  |  |_|  ||   |_| ||  _    ||   _   ||       |
    |   |_||_ |       ||       || | |   ||  | |  ||       |
    |    __  ||       ||  _    || |_|   ||  |_|  ||       |
    |   |  | ||   _   || | |   ||       ||       || ||_|| |
    |___|  |_||__| |__||_|  |__||______| |_______||_|   |_|
  */

  /**
   * Returns a random number between a min and max
   * Utilizing https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
   * @param {Number} min
   * @param {Number} max
   * @returns {Number} randomNumber
   */
  randomBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random value from an array
   * @param {Array} arr
   * @returns Random value
   */
  randomChoice(arr) {
    return arr[this.randomBetween(0, arr.length - 1)];
  }

  /* 
     _______  ___   __   __  _______ 
    |       ||   | |  |_|  ||       |
    |_     _||   | |       ||    ___|
      |   |  |   | |       ||   |___ 
      |   |  |   | |       ||    ___|
      |   |  |   | | ||_|| ||   |___ 
      |___|  |___| |_|   |_||_______|
  */

  /**
   * Returns time passed in seconds since timeStamp
   * @param {Date} timeStamp
   * @returns {Number} Time passed in seconds
   */
  getTimePassed(timeStamp) {
    return (new Date().getTime() - timeStamp) / 1000;
  }

  /**
   * Converts seconds to time format
   * Utilizes https://stackoverflow.com/a/52387803
   * @param {Number} seconds
   * @param {String} conjunction
   * @param {Boolean} abbreviate
   * @returns {String} Time format
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
   * Put program to sleep for x milliseconds
   * Utilizes https://www.sitepoint.com/delay-sleep-pause-wait/
   * @param {Number} milliseconds
   */
  async sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
}

export default Helper;
