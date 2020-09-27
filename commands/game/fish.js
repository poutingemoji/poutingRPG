require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { addExp, incrementValue, addFish, incrementQuest } = require("../../database/functions");

const { percentageChance } = require("../../utils/helpers/arrHelper");
const { currencies, fishes } = require("../../utils/helpers/enumHelper");

const emojis = require("../../docs/data/emojis.js");

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
    player.addFish = addFish;
    player.incrementValue = incrementValue;
    player.incrementQuest = incrementQuest;
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
        description += `*You earned ${curName}:* **+ ${fish[curName]}** ${emojis[curName]}\n`;
        description += `*You earned experience:* **+ ${exp}** ${emojis["exp"]}`;
        player.incrementValue(curName, fish[curName]);
        player.addExp(exp, msg);
        player.addFish(fishName);
    }
    messageEmbed.setDescription(description);
    msg.say(messageEmbed);
  }
};
