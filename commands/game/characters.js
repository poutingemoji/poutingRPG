require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const {
  getCharProperty,
} = require("../../database/functions");

const { paginate } = require("../../utils/helpers/arrHelper");
const { buildEmbeds } = require("../../utils/helpers/msgHelper");

const Positions = require("../../docs/data/Positions");

module.exports = class CharactersCommand extends Command {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: [],
      group: "game",
      memberName: "characters",
      description: "Claim your daily reward.",
      examples: [`${client.commandPrefix}daily`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await findPlayer(msg.author, msg);
    player.getCharProperty = getCharProperty;
    const charactersOwned = Object.keys(player.characters_Owned);

    const embeds = [];

    var { maxPage } = paginate(charactersOwned);
    for (var page = 0; page < maxPage; page++) {
      var { items } = paginate(charactersOwned, page + 1);
      var description = "";
      for (var i = 0; i < items.length; i++) {
        const id = charactersOwned[i]
        const [name, position, level, duplicates] = [
          player.getCharProperty("name", msg, id),
          player.getCharProperty("position", msg, id),
          player.getCharProperty("level", msg, id),
          player.getCharProperty("duplicates", msg, id),
        ];
        description += `**${name}** ${Positions[position].emoji} | Level: ${level} | Duplicates: ${duplicates} | [ID: ${id}](https://www.twitch.tv/pokimane)`;
      }
      embeds.push(
        new MessageEmbed()
        .setTitle(`[Page ${page + 1}/${maxPage}]`)
        .setDescription(description)
      );
    }

    buildEmbeds(
      msg,
      embeds
    );
  }
};
