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
		["game", "Tower of God Commands"],
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
})

//Update Commands Table Info (WEBSITE)
const groups = client.registry.groups
let commands = []
const jsonFiles = {
	["Moderation Commands"] : "moderation",
	["Tower of God Commands"] : "game",
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
