require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { getCharProperty } = require("../../database/functions");

const { stars } = require("../../utils/helpers/msgHelper");

const { positions } = require("../../docs/data/Emojis");

module.exports = class InfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "info",
      aliases: [],
      group: "game",
      memberName: "info",
      description: "Get info on your character.",
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "char",
          prompt: `What character would you like to get more info on?`,
          type: "string",
          default: "irregular",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { char }) {
    const player = await findPlayer(msg.author, msg);
    if (!player.characters_Owned.hasOwnProperty(char)) return;
    player.getCharProperty = getCharProperty;
    console.log(player.getCharProperty("rarity"));
    const [name, position, rarity, weapon, level, EXP, Max_EXP, attributes] = [
      player.getCharProperty("name", msg),
      player.getCharProperty("position"),
      player.getCharProperty("rarity"),
      player.getCharProperty("weapon"),
      player.getCharProperty("level"),
      player.getCharProperty("EXP"),
      player.getCharProperty("Max_EXP"),
      player.getCharProperty("attributes"),
    ];

    const messageEmbed = new MessageEmbed()
      .setTitle(`${name} ${positions[position]}\n` + `${stars(msg, rarity)}`)
      .setImage(msg.author.displayAvatarURL());
    var description = `Weapon: ${weapon}\n`;
    description += `Level ${level}/${(rarity + 1) * 20}\n`;
    description += `EXP: ${EXP}/${Max_EXP}\n\n`;
    for (var attribute in attributes) {
      description += `${attribute.replace(/_/g, " ")}: ${
        attributes[attribute]
      }\n`;
    }

    messageEmbed.setDescription(description);
    msg.say(messageEmbed);
  }
};
