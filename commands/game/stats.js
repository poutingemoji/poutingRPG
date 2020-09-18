require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");

const moves = require("../../docs/data/moves.js");

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      aliases: [],
      group: "game",
      memberName: "stats",
      description: "Display your stats and stat points.",
      examples: [`${client.commandPrefix}stats`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg) {
    const player = await findPlayer(msg, msg.author);
    const stats = [
      {
        ["⚗️ Baang (Max Shinsu)"]: player.baang,
        ["🌧️ Myun (Accuracy)"]: player.myun,
        ["☄️ Soo (Shinsu Dmg)"]: player.soo,
      },
      {
        ["🛡️ Durability (Max Health)"]: player.durability,
        ["🍃 Speed (Dodge + Critical)"]: player.speed,
        ["👊 Physical (Physical Dmg)"]: player.physical,
      },
    ];

    let statsMessage = `➡️ Stat Points: **${player.statpoints}**\n`;
    stats.forEach((category) => {
      statsMessage += `────────────\n`;
      for (var key in category) {
        statsMessage += `${key}: **${category[key]}**\n`;
      }
    });
    const messageEmbed = new MessageEmbed()
      .setColor("#56acef")
      .setTitle(`${msg.author.username}'s Statistics`)
      .setDescription(statsMessage);
    msg.say(messageEmbed);
  }
};
