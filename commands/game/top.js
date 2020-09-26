require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { loadTopPlayers } = require("../../database/Database");

const { paginate } = require("../../utils/helpers/arrHelper.js");
const { buildEmbeds, commandInfo } = require("../../utils/helpers/msgHelper");

const positions = require("../../docs/data/positions.js");

const pageLength = 10;
const sorts = {
  [false]: {
    sort: { level: -1, exp: -1 },
    where: "level",
  },
  ["points"]: {
    sort: { points: -1 },
    where: "points",
  },
  ["dallars"]: {
    sort: { dallars: -1 },
    where: "dallars",
  },
  ["fish"]: {
    sort: { "fishes.\nTotal Amount": -1 },
    where: "fishes.\nTotal Amount",
    gte: 1,
  },
  ["reputation"]: {
    sort: { reputation: -1 },
    where: "reputation",
  },
};

module.exports = class TopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "top",
      aliases: ["leaderboard"],
      group: "game",
      memberName: "top",
      description: "Displays the top players.",
      examples: [
        `${client.commandPrefix}top`,
        `${client.commandPrefix}top points`,
        `${client.commandPrefix}top dallars`,
        `${client.commandPrefix}top reputation`,
        `${client.commandPrefix}top fish`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "sort",
          prompt: "What would you like to sort the leaderboard by?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 4,
      },
    });
  }

  async run(msg, { sort }) {
    if (!Object.keys(sorts).includes(sort) && sort !== false) {
      return commandInfo(msg, this);
    }

    const res = await loadTopPlayers(
      sorts[sort].sort,
      sorts[sort].where,
      sorts[sort].gte || 0
    );
    if (res.length == 0)
      return msg.say("There is no data for this leaderboard.");
    var yourPosition = false;
    var yourPage;

    const embeds = [];

    var { maxPage } = paginate(res, 1, pageLength);
    for (let page = 0; page < maxPage; page++) {
      var { items } = paginate(res, page + 1, pageLength);
      let topPlayers = "";
      for (let item = 0; item < items.length; item++) {
        const player = items[item];
        const user = await msg.client.users.fetch(player.playerId);

        let position = page * pageLength + item;
        if (player.playerId == msg.author.id) {
          yourPosition = position + 1;
          yourPage = page + 1;
        }

        const medals = ["🥇", "🥈", "🥉"];
        if (medals[position]) {
          position = medals[position];
        } else {
          position = `${position + 1})`;
        }

        topPlayers += `${position}    ${
          positions[player.position[0]].emoji
        }  **${user.username}** ─ `;
        switch (sort) {
          default:
            topPlayers += `Lvl: ${player.level} ─ Exp: ${player.exp}\n`;
            break;
          case "points":
            topPlayers += `Points: ${player.points}\n`;
            break;
          case "dallars":
            topPlayers += `Dallars: ${player.dallars}\n`;
            break;
          case "reputation":
            topPlayers += `Reputation: ${player.reputation}\n`;
            break;
          case "fish":
            topPlayers += `Total Fish: ${player.fishes.get(
              "\nTotal Amount"
            )}\n`;
            break;
        }
      }
      embeds.push(
        new MessageEmbed()
          .setTitle(`[Page ${page + 1}/${maxPage}]`)
          .setDescription(topPlayers)
      );
    }

    buildEmbeds(
      msg,
      embeds,
      `Your position: ${
        yourPosition
          ? `${yourPosition}/${res.length} [Page ${yourPage}]`
          : "Unranked"
      }`
    );
  }
};
