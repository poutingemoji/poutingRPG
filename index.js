const fs = require('fs')
const { CommandoClient } = require("discord.js-commando")
const path = require("path")
const { 
	prefix, 
	TOKEN, 
	MONGODBKEY, 
	baseExpMultiplier, 
	exponentialExpMultiplier, 
	expCooldown 
} = require("./config.json")

//Creating Commando Client
const client = new CommandoClient({
	commandPrefix: prefix,
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
	client.user.setActivity(`${prefix}help`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/rikaaaa_"
	})
})
client.on("error", console.error)
client.login(TOKEN)

//Connecting to MongoDB Database
const mongoose = require("mongoose")
const Userstat = require("./models/userstat")
const MONGODB = process.env.MONGODB_URI || MONGODBKEY
mongoose.connect(MONGODB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
})

const talkedRecently = new Set()
client.on('message', message => {
	if (message.author.bot) return
	//EXP For Talking (1-min Cooldown)
	if (talkedRecently.has(message.author.id)) {
		return
	}
	talkedRecently.add(message.author.id)
	setTimeout(() => {
	  talkedRecently.delete(message.author.id)
	}, expCooldown)
	//Random Chance to Get a Tower of God Test
	if (Math.random() >= 0.99) {
		const giveaway = giveaways[randomIntFromInterval(0,5)]
		messageEvent(message, giveaway[0], giveaway[1], giveaway[2], giveaway[3], giveaway[4], giveaway[5], giveaway[6])
	}
	//Adding Random EXP Amt and Checking Level Up
	let expAdd = randomIntFromInterval(15, 25)
	Userstat.findOne({
		userID: message.author.id,
	}, (err, currentUserstat) => {
		if (err) console.log(err)
		if (!currentUserstat) {
            const userstat = new Userstat({
                userID: message.author.id,
                totalExp: expAdd,
                currentExp: expAdd,
                level: 1,
                points: 0,
                position: 'No Position',
                irregular: false,
				rank: 30,
				inventory: {},
            })
			userstat.save().catch(err => console.log(err))
		} else {
			let currentExp = currentUserstat.currentExp
			let currentLevel = currentUserstat.level
			let nextLevel = Math.floor(baseExpMultiplier *(Math.pow(currentLevel, exponentialExpMultiplier)))
			currentUserstat.totalExp = currentUserstat.totalExp + expAdd
			currentUserstat.currentExp = currentUserstat.currentExp + expAdd

			if(nextLevel <= currentExp) {
				currentUserstat.level++
				currentUserstat.currentExp = 0
				message.say(`${emoji(message, "729255616786464848")} You are now **Level ${currentLevel + 1}**! ${emoji(message, "729255637837414450")}`)
			}
			currentUserstat.save().catch(err => console.log(err))
		}
	})
})

//Adventure Tests 
const { GiveawaysManager } = require("discord-giveaways")
const manager = new GiveawaysManager(client, {
	storage: "./giveaways.json",
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

function randomIntFromInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function emoji(message, emojiID) {
    return message.client.emojis.cache.get(emojiID).toString()
}

fs.writeFile('./giveaways.json', '[]', function() {console.log('giveaways.json Cleared.')})

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
				secondsToDhms(cmd.throttling.duration)
				])
			)
		}
	)
	commandsInfo[jsonFiles[key]] = commands
	commands = []
})
fs.writeFile(`./docs/commandinfo.json`, JSON.stringify(commandsInfo), function() {console.log('commandinfo.json Refreshed.')})

function secondsToDhms(seconds) {
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