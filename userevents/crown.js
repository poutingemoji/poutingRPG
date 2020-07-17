module.exports.userevent = function(message) {
    message.say('\:crown: __**Crown Game**__ \:crown:\nBe the first to type `I have the crown` to claim possession of the crown.')
    const start = new Date().getTime();
    const filter = response => response.content.toLowerCase() === 'i have the crown'
    message.channel.awaitMessages(filter, { max: 1, time: 30000 })
    .then(collected => {
        message.say(`https://tenor.com/view/tower-of-god-tog-kami-no-tou-anime-khun-aguero-agnis-gif-17479176 \n \:crown: **${collected.first().author.tag}** won the crown game in **${Math.round(100*(new Date().getTime() - start)/1000)/100}** second(s)!`)
    })
    .catch(collected => {
        message.say(`https://tenor.com/view/crown-game-tower-of-god-long-green-whip-hit-gif-17039887 Looks like nobody won this time.`)
    });
}