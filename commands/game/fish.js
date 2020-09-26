require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { addExp, incrementValue, addFish } = require("../../database/functions");

const { percentageChance } = require("../../utils/helpers/arrHelper");
const { currencies, fishes } = require("../../utils/helpers/enumHelper");

module.exports = class FishCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fish",
      aliases: [],
      group: "game",
      memberName: "fish",
      description: "Do your fishing.",
      examples: [
        `${client.commandPrefix}fish`,
        `${client.commandPrefix}fish stats`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "stats",
          prompt: "Would you like to see your fishing stats?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(msg, { stats }) {
    const player = await findPlayer(msg.author, msg);
    player.addExp = addExp;
    player.incrementValue = incrementValue;
    player.addFish = addFish;
    const messageEmbed = new MessageEmbed().setColor("#2f3136");
    let description = "";
    switch (stats) {
      case "stats":
        messageEmbed.setTitle(`${msg.author.username}'s Fishing Statistics 🎣`);
        player.fishes.forEach((value, key) => {
          description += `${fishes[key].emoji} ${key}: **${value}**\n`;
        });
        break;
      default:
        const fishName = percentageChance(
          Object.keys(fishes),
          Object.values(fishes).map((res) => res.rarity)
        );
        const fish = fishes[fishName];
        description = `🎣 ${msg.author.username} fished out: **${fishName} ${fish.emoji}** !\n\n`;

        const curName = fish.hasOwnProperty("points") ? "points" : "dallars";
        const exp = Math.floor(fish[curName] / 1.5);
        description += `*You earned ${curName}:* **+ ${fish[curName]}** ${currencies[curName].emoji}\n`;
        description += `*You earned experience:* **+ ${exp}** ✨`;
        player.incrementValue(msg.author, curName, fish[curName]);
        player.addExp(exp, msg);
        player.addFish(fishName);
    }
    messageEmbed.setDescription(description);
    msg.say(messageEmbed);
  }
};
