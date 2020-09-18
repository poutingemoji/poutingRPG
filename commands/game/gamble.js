require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer, changeValuePlayer } = require("../../database/Database");
const { titleCase, numberWithCommas } = require("../../utils/Helper");
const { embedColors, positionColors } = require("../../utils/enumHelper");

const moves = require("../../docs/data/moves.js");
const positions = require("../../docs/data/positions");

const minLimit = 500;
const maxLimit = 30000;
const highestRoll = 12;

module.exports = class GambleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "gamble",
      aliases: [],
      group: "game",
      memberName: "gamble",
      description: "Gamble your points away.",
      examples: [
        `${client.commandPrefix}gamble [points]`,
        `${client.commandPrefix}gamble all`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "points",
          prompt: "How much would you like to gamble?",
          type: "string",
          validate: (num) => {
            if (isNaN(num) && num !== "all") return;
            if (!Number.isInteger(parseInt(num)) && num !== "all")
              return "You need to provide an integer.";
            if (num < minLimit)
              return `You need to gamble at least ${minLimit} points.`;
            if (num > maxLimit)
              return `You can't gamble more than ${maxLimit}.`;
            return true;
          },
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg, { points }) {
    const player = await findPlayer(msg, msg.author);
    if (points == "all") {
      if (points < minLimit)
        return `You need to gamble at least ${minLimit} points.`;
      if (player.points > maxLimit) {
        points = maxLimit;
      } else {
        points = player.points;
      }
    }
    console.log(points);
    if (points > player.points)
      return msg.say(`You don't have ${points} points.`);
    const roll1 = Math.floor(Math.random() * highestRoll);
    const roll2 = Math.floor(Math.random() * highestRoll);
    var pointsChange = Math.round(
      points * (((roll1 - roll2) * highestRoll) / 100)
    );
    if (-points > pointsChange) pointsChange = -points;
    changeValuePlayer(msg.author, "points", pointsChange);

    const messageEmbed = new MessageEmbed()
      .setAuthor(
        "Khun's Gambling Game",
        "https://cdn.discordapp.com/attachments/722720878932262952/756417772304465990/Khun_Aguero_Agnis.png"
      )
      .addFields(
        {
          name: msg.author.username,
          value: `Rolled \`${roll1}\``,
          inline: true,
        },
        {
          name: "Khun Aguero Agnis",
          value: `Rolled \`${roll2}\``,
          inline: true,
        }
      );

    var changeMsg;
    switch (Math.sign(pointsChange)) {
      case 1:
        messageEmbed.setColor(positionColors.scout);
        changeMsg = "won";
        break;
      case -1:
        messageEmbed.setColor(positionColors.fisherman);
        changeMsg = "lost";
        break;
      default:
        messageEmbed.setColor(embedColors.game);
        changeMsg = "won/lost";
    }
    messageEmbed.setDescription(
      `You ${changeMsg} ${numberWithCommas(Math.abs(pointsChange))} points.${
        Math.sign(pointsChange) !== 0
          ? `\n**Percent of Bet ${titleCase(changeMsg)}**: ${Math.round(
              (pointsChange / points) * 100
            )}%`
          : ""
      }\n\nYou now have ${numberWithCommas(player.points + pointsChange)} points.`
    );
    msg.say(messageEmbed);
  }
};
