const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const mongoose = require("mongoose");
const { prefix, TOKEN, MONGODBKEY, expCooldown } = require("./config.json");
const Userstat = require("./Models/userstat");

//Creating Commando Client
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
		url: "https://www.twitch.tv/rikaaaa_"
	});
});

client.on("error", console.error);

client.login(TOKEN);

//Connecting to MongoDB Database
const MONGODB = process.env.MONGODB_URI || MONGODBKEY;
mongoose.connect(MONGODB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

//EXP For Talking (1-min Cooldown)
const talkedRecently = new Set();
client.on('message', message => {
	if (message.author.bot) return;
	if (talkedRecently.has(message.author.id)) {
		return
	};

	talkedRecently.add(message.author.id);
	setTimeout(() => {
	  talkedRecently.delete(message.author.id);
	}, expCooldown);
	
	let expAdd = Math.floor(Math.random() * 7) + 8;
	Userstat.findOne({
		userID: message.author.id,
	}, (err, currentUserstat) => {
		if (err) console.log(err);
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
            });
			userstat.save().catch(err => console.log(err))
		} else {
			let currentExp = currentUserstat.currentExp;
			let currentLevel = currentUserstat.level;
			let nextLevel = Math.floor(100 *(Math.pow(currentLevel, 1.04)));

			currentUserstat.totalExp = currentUserstat.totalExp + expAdd;
			currentUserstat.currentExp = currentUserstat.currentExp + expAdd;

			if(nextLevel <= currentExp) {
				currentUserstat.level = currentLevel + 1;
				currentUserstat.currentExp = 0;
				message.say(`Congratz on reaching Level ${currentLevel + 1}. Ur gonna be the next Hokage fam.`);
			};
			currentUserstat.save().catch(err => console.log(err));
		}; 
	});
});