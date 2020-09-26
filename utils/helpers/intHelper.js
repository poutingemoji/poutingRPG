const intHelper = {
  //Integer
  numberWithCommas(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  clamp(int, min, max) {
    return int <= min ? min : int >= max ? max : int;
  },
  isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
  },
  secondsToDhms(seconds, conjunction, abbreviate) {
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
  },
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

module.exports = intHelper;
