const Helper = {
  disambiguation(items, label, property = "name") {
    const itemList = items
      .map(
        (item) =>
          `"${(property ? item[property] : item).replace(/ /g, "\xa0")}"`
      )
      .join(",   ");
    return `Multiple ${label} found, please be more specific: ${itemList}`;
  },

  paginate(items, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;
    return {
      items:
        items.length > pageLength
          ? items.slice(startIndex, startIndex + pageLength)
          : items,
      page,
      maxPage,
      pageLength,
    };
  },

  codeBlock(str, syntax = "") {
    return `\`\`\`${syntax}\n${str}\n\`\`\`\n`;
  },

  titleCase(str) {
    str = String(str);
    str = str.replace(/_/g, " ");
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  },

  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },

  isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
  },

  secondsToDhms(seconds, conjunction, abbreviate, splice) {
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
    if (splice) Display.splice(-1, splice);
    return Display.filter(Boolean).join(conjunction);
  },

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

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
  },

  percentageChance(values, chances) {
    for (var i = 0, pool = []; i < chances.length; i++) {
      for (var i2 = 0; i2 < chances[i]; i2++) {
        pool.push(i);
      }
    }
    return values[Helper.arrayShuffle(pool)["0"]];
  },
};

module.exports = Helper;
