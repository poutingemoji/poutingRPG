const fs = require('fs')
const { CommandoClient } = require("discord.js-commando")
const path = require("path")
const Helper = require('./utils/Helper')
require('dotenv').config()

//Creating Commando Client
const client = new CommandoClient({
	commandPrefix: process.env.PREFIX,
	owner: "257641125135908866",
	invite: "https://discord.gg/nGVe96h",
	disableEveryone: true
})
client.registry
	.registerDefaultTypes()
	.registerGroups([
		["moderation", "Moderation Commands"],
		["tower", "Tower of God Commands"],
		["info", "Info Commands"],
		["fun", "Fun Commands"],
		["social", "Social Commands"],
		["utility", "Utility Commands"],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false,
		help: false
	})
	.registerCommandsIn(path.join(__dirname, "commands"))

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
	client.user.setActivity(`${process.env.PREFIX}help`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/pokimane"
  })
  console.log("Guilds: " + client.guilds.cache.size)
  console.log("Users: " + client.users.cache.size)
  client.guilds.cache.map(guild => console.log(guild.memberCount))
})
client.on("error", console.error)
client.login(process.env.TOKEN)

client.on('message', message => {
	if (message.author.bot) return
	//Random Chance to Get a Tower of God Test
	if (Math.random() >= 0.99) {
		const giveaway = giveaways[Helper.randomIntFromInterval(0,5)]
		messageEvent(message, giveaway[0], giveaway[1], giveaway[2], giveaway[3], giveaway[4], giveaway[5], giveaway[6])
	}
})

//Adventure Tests 
const { GiveawaysManager } = require("discord-giveaways")
const manager = new GiveawaysManager(client, {
	storage: "./data/giveaways.json",
	updateCountdownEvery: 5000,
	default: {
		botsCanWin: false,
		exemptPermissions: [],
		embedColor: "#FF0000",
		reaction: "🎉"
	}
})
const giveaways = [
	//time, prize, winnerCount, embedColor, giveawayName, emoji, reaction
	[5000, "Deathmatch Badge", 1, "#f2f2f2", "Deathmatch Test", "💀", "⚔️"],
	[5000, "Endurance Badge", 2, "#54adef", "Lero-Ro's Test", "🌊", "💪"],
	[5000, "Door Badge", 3, "#ff5446", "Door Test", "🚪", "🧠"],
	[5000, "Crown Badge", 1, "#ffaf2c", "Crown Game [BONUS]", "👑", "⚔️"],
	[5000, "Hide-and-Seek Badge", 3, "#c16a50", "Hide-and-Seek", "🙈", "🏃"],
	[5000, "Submerged Fish Badge", 1, "#54adef", "Submerged Fish Hunt Test [GUARDIAN]", "🐟", "🎣"],
]
function messageEvent(message, time, prize, winnerCount, embedColor, giveawayName, emoji, reaction) {
	manager.start(message.channel, {
    time: time,
    prize: prize,
		winnerCount: parseInt(winnerCount),
		embedColor: embedColor,
		reaction: reaction,
    messages: {
      giveaway: `${emoji} **${giveawayName}** ${emoji}`,
      giveawayEnded: `${emoji} **${giveawayName} ENDED** ${emoji}`,
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: `React with ${reaction} to participate!`,
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
      noWinner: "Test cancelled, no Regulars participated.",
      winners: "winner(s)",
			endedAt: "Ended at",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false
      }
    }
  })
}

fs.writeFile('./data/giveaways.json', '[]', function() {console.log('giveaways.json Cleared.')})

//Update Commands Table Info (WEBSITE)
const groups = client.registry.groups
let commands = []
const jsonFiles = {
	["Moderation Commands"] : "moderation",
	["Tower of God Commands"] : "tower",
	["Info Commands"] : "info",
	["Social Commands"] : "social",
	["Utility Commands"] : "utility",
}
let commandsInfo = {}
Object.keys(jsonFiles).forEach(function(key) {
	groups.filter(grp => grp.name === key && grp.commands.some(cmd => !cmd.hidden)).map(grp => 
		{
			grp.commands.filter(cmd => !cmd.hidden)
			.map(cmd => commands.push([
				`${cmd.name}`, 
				`${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`,
				cmd.examples.join("\n"), 
				cmd.aliases.join("\n"), 
				Helper.secondsToDhms(cmd.throttling.duration)
				])
			)
		}
	)
	commandsInfo[jsonFiles[key]] = commands
	commands = []
})
fs.writeFile(`./docs/commandinfo.json`, JSON.stringify(commandsInfo), function() {console.log('commandinfo.json Refreshed.')})
