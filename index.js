const { prefix, TOKEN, MONGODBKEY } = require("./config.json");

const Userstat = require("./models/userstat");
const mongoose = require("mongoose");
var url = process.env.MONGODB_URI || MONGODBKEY;
mongoose.connect(url, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const client = new CommandoClient({
	commandPrefix: prefix,
	owner: "257641125135908866",
	invite: "https://discord.gg/nGVe96h",
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		["moderation", "Moderation Commands"],
		["music", "Music Commands"],
		["info", "User-Info Commands"],
		["level", "Level Commands"],
		["memes", "Meme Commands"],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
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