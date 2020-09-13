require('dotenv').config()

const { CommandoClient } = require("discord.js-commando")

const { secondsToDhms } = require('./utils/Helper')
const { links } = require('./utils/enumHelper')

const DBL = require("dblapi.js");

const fs = require('fs');
const path = require("path");

const client = new CommandoClient({
	commandPrefix: process.env.DEVPREFIX || process.env.PREFIX,
	owner: "257641125135908866",
	invite: links.supportServer,
  disableEveryone: true,
  shards: 'auto',
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

if (!process.env.DEVPREFIX) {
  const dbl = new DBL(process.env.DISCORDBOTLISTKEY, client);

  dbl.on('posted', () => {
    console.log('Server count posted!');
  })
  
  dbl.on('error', err => {
   console.error(err);
  })
}

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
	client.user.setActivity(`${process.env.DEVPREFIX || process.env.PREFIX}help`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/pokimane"
  })
  console.log("Guilds: " + client.guilds.cache.size)
  console.log("Users: " + client.users.cache.size)
})
client.on("error", console.error)
client.login(process.env.TOKEN)

client.on('message', msg => {
  if (msg.author.bot) return
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
				secondsToDhms(cmd.throttling.duration, ', ')
				])
			)
		}
	)
	commandsInfo[jsonFiles[key]] = commands
	commands = []
})
fs.writeFile(`./docs/commandinfo.json`, JSON.stringify(commandsInfo), function() {console.log('commandinfo.json Refreshed.')})
