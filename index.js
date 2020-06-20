const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, color } = require('./config.json');
let xp = require('./xp.json')
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = [
	fs.readdirSync('./commands').filter(file => file.endsWith('.js')),
	fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js')),
	fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js')),
	fs.readdirSync('./commands/playerinfo').filter(file => file.endsWith('.js')),
]
const commandTypes = ['', 'fun/', 'moderation/', 'playerinfo/']
for (var commandTypeIndex = 0; commandTypeIndex < 4; commandTypeIndex++) {
	for (const file of commandFiles[commandTypeIndex]) {
		const command = require(`./commands/${commandTypes[commandTypeIndex]}${file}`);
		client.commands.set(command.name, command);
	}
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(".help", {
		type: "STREAMING",
		url: "https://www.twitch.tv/pokimane"
	  });
});

client.on('message', message => {
	console.log('here')
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	let xpAdd = Math.floor(Math.random() * 7) + 8
	console.log(xpAdd)

	if(!xp[message.author.id]) {
		xp[message.author.id] = {
			xp: 0,
			level: 1,
		}
	}

	let curxp = xp[message.author.id].xp
	let curlevel = xp[message.author.id].level
	let nxtLvl = xp[message.author.id].level * 300

	xp[message.author.id].xp = curxp + xpAdd

	if (nxtLvl <= xp[message.author.id].xp) {
		xp[message.author.id].level = curlevel + 1
		message.channel.send(`ur level ${curlevel + 1} now bro, good shit`)
	}

	fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
		if(err) console.log(err)
	})

	console.log(`level is ${xp[message.author.id].level}`)

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	
	if (command.ownerOnly && message.author.id !== "257641125135908866") return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
