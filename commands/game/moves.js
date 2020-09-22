require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { numberWithCommas, paginate } = require("../../utils/Helper");
const { commandInfo, buildEmbeds } = require("../../utils/msgHelper");
const { embedColors, links } = require("../../utils/enumHelper");

const families = require("../../docs/data/families.js");
const races = require("../../docs/data/races.js");
const positions = require("../../docs/data/positions.js");
const moves = require("../../docs/data/moves.js");

const { getAvailableMoves } = require("../../database/functions");

const pageLength = 4;
const oneOf = ["", "list"];

module.exports = class MovesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "moves",
      aliases: [],
      group: "game",
      memberName: "moves",
      description: "Displays your moves.",
      examples: [
        `${client.commandPrefix}moves`,
        `${client.commandPrefix}moves list`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "action",
          prompt: "What would you like to do with your moves?",
          type: "string",
          default: "",
        },
      ],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg, { action }) {
    const player = await findPlayer(msg.author, msg);
    player.getAvailableMoves = getAvailableMoves;
    const availableMoves = player.getAvailableMoves();
    if (!oneOf.includes(action) && !availableMoves.hasOwnProperty(action)) {
      return commandInfo(msg, this);
    }

    switch (action) {
      case "list":
        if (availableMoves.length == 0)
          return msg.say("You don't have any available moves.");
        const embeds = [];
        var { maxPage } = paginate(availableMoves, 1, pageLength);
        for (let page = 0; page < maxPage; page++) {
          var { items } = paginate(availableMoves, page + 1, pageLength);
          let itemsOffered = "";
          for (let item = 0; item < items.length; item++) {
            const itemInfo = moves[items[item]];
            itemsOffered += `${itemInfo.category == "shinsu" ? "🌊" : "👊"} **${
              itemInfo.name
            }**\n*[id: ${items[item]}](${links.website})*\nEnergy: ${
              itemInfo.energy
            }\nPower: ${itemInfo.power}\nAccuracy: ${itemInfo.accuracy}\n`;
          }
          embeds.push(
            new MessageEmbed()
              .setTitle(
                `${msg.author.username}'s Available Moves\n[Page ${
                  page + 1
                }/${maxPage}]`
              )
              .setDescription(itemsOffered)
          );
        }
        buildEmbeds(
          msg,
          embeds,
          `To purchase a pet: ${this.client.commandPrefix}pet [id]`
        );
        break;
      default:
        const messageEmbed = new MessageEmbed()
          .setColor(embedColors.game)
          .setTitle(`${msg.author.username}'s Current Moves`)
          .setFooter(`To view available moves: ${msg.client.commandPrefix}moves list`)
        for (var i = 0; i < 4; i++) {
          var iteminfo = "";
          const currentMove = moves[player.move[i]];
          if (currentMove) {
            iteminfo += `${currentMove.category == "shinsu" ? "🌊" : "👊"} **${
              currentMove.name
            }**\n*[id: ${player.move[i]}](${links.website})*\nEnergy: ${
              currentMove.energy
            }\nPower: ${currentMove.power}\nAccuracy: ${
              currentMove.accuracy
            }`;
          } else {
            iteminfo += `None`;
          }
          messageEmbed.addField(`Move ${i + 1}:`, iteminfo);
        }
        msg.say(messageEmbed);
    }
  }
};
