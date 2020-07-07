const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { prefix, OPENWEATHERMAPKEY } = require("../../config.json");
const fetch = require("node-fetch")
module.exports = class WeatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			aliases: [],
			group: 'utility',
			memberName: 'weather',
            description: 'A Weather App in Discord.',
            examples: [`${prefix}weather [place or postal code]`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: false,
            args: [
                {
                    key: 'place',
                    prompt: 'Where would you like to get the weather information from?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 1,
                duration: 10
            },
        });
    };
    async run(message, {place}) {
        let weatherInfo;
        if (isNaN(place)) {
            weatherInfo = await fetchWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${OPENWEATHERMAPKEY}`)
        } else {
            weatherInfo = await fetchWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?zip=${place}&appid=${OPENWEATHERMAPKEY}`)
        }
        console.log(weatherInfo)
        const weatherEmbed = new MessageEmbed()
            .setColor('#99ccff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addFields(
                {name: "Location", value: weatherInfo["name"] + ", " + weatherInfo["sys"]["country"], inline: true},
                {name: "Temperature", value: Math.floor((weatherInfo["main"]["temp"] - 273.15) * 9/5 + 32) + "°F", inline: true},
                {name: "Current Weather", value: weatherInfo["weather"]["main"], inline: true },
                {name: "Humidity", value: weatherInfo["main"]["humidity"] + "%", inline: true },
                {name: "Wind Speed", value: weatherInfo["wind"]["speed"], inline: true },
            )
            .setTimestamp()
        return message.say(randomTip(message, weatherEmbed));
    };
};

async function fetchWeatherInfo(URL) {
    console.log(URL)
    const res = await fetch(URL)
    return await res.json();
}