const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const mongoose = require("mongoose");
const { prefix, TOKEN, MONGODBKEY } = require("./config.json");
const Userstat = require("./models/userstat");

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: "257641125135908866",
	invite: "https://discord.gg/nGVe96h",
	disableEveryone: true
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		["administration", "Administration Commands"],
		["moderation", "Moderation Commands"],
		["tower", "Tower of God Commands"],
		["info", "Info Commands"],
		["fun", "Fun Commands"],
		["social", "Social Commands"],
		["image", "Image Commands"],
		["music", "Music Commands"],
		["utility", "Utility Commands"],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`${prefix}help`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/pokimane"
	});
});

client.on("error", console.error);

client.login(TOKEN);

var MONGODB = process.env.MONGODB_URI || MONGODBKEY;
mongoose.connect(MONGODB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});