const functions = {
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
    randomIntFromInterval(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    },
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    secondsToDhms(seconds) {
        seconds = Number(seconds)
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

module.exports = functions