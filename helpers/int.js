module.exports = {
    randomIntFromInterval(min, max){
        min = parseInt(min)
        max = parseInt(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    },
    numberWithCommas(int) {
        int = parseInt(int)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    secondsToDhms(seconds) {
        seconds = parseInt(seconds)
        var d = Math.floor(seconds / (3600*24))
        var h = Math.floor(seconds % (3600*24) / 3600)
        var m = Math.floor(seconds % 3600 / 60)
        var s = Math.floor(seconds % 60)
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days, ") : ""
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
        return dDisplay + hDisplay + mDisplay + sDisplay
    }
}
