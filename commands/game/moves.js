require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { numberWithCommas, paginate } = require("../../utils/Helper");
const {
  commandInfo,
  buildEmbeds,
  choose123,
} = require("../../utils/msgHelper");
const { totalNumOfMoves, embedColors, links } = require("../../utils/enumHelper");

const families = require("../../docs/data/families.js");
const races = require("../../docs/data/races.js");
const positions = require("../../docs/data/positions.js");
const moves = require("../../docs/data/moves.js");

const { getAvailableMoves, upsertMove } = require("../../database/functions");

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
    player.upsertMove = upsertMove;
    const availableMoves = player.getAvailableMoves();
    if (!oneOf.includes(action) && !availableMoves.includes(action)) {
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
            itemsOffered += moveInfo(items[item]);
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
          `To learn a move: ${this.client.commandPrefix}moves [id]`
        );
        break;
      default:
        if (availableMoves.includes(action) && totalNumOfMoves > player.move) {
          return player.upsertMove(action);
         
        }
        const messageEmbed = new MessageEmbed()
          .setColor(embedColors.game)
          .setTitle(`${msg.author.username}'s Current Moves`)
          .setFooter(
            `To view available moves: ${msg.client.commandPrefix}moves list`
          );
        for (var i = 0; i < totalNumOfMoves; i++) {
          var itemInfo = "";
          const currentMove = moves[player.move[i]];
          if (currentMove) {
            itemInfo += moveInfo(player.move[i]);
          } else {
            itemInfo += `None`;
          }
          messageEmbed.addField(`Move ${i + 1}:`, itemInfo, true);
        }
        //&& totalNumOfMoves == player.move.length
        if (availableMoves.includes(action)) {
          const res = await choose123(
            msg,
            `${
              msg.author
            }, which move would you like to replace with ${moveName(
              moves[action]
            )}?`,
            messageEmbed
          );
          player.upsertMove(action, res)
          return;
        }
        msg.say(messageEmbed);
    }
  }
};

function moveInfo(id) {
  return `${moveName(moves[id])}\n*[id: ${id}](${links.website})*\nEnergy: ${
    moves[id].energy
  }\nPower: ${moves[id].power}\nAccuracy: ${moves[id].accuracy}\n`;
}

function moveName(move) {
  return `${move.category == "shinsu" ? "🌊" : "👊"} **${move.name}**`;
}
