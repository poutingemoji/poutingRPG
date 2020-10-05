require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const {
  addExp,
  incrementValue,
  getCharProperty,
} = require("../../database/functions");

const { romanize } = require("../../utils/helpers/intHelper");
const { emoji } = require("../../utils/helpers/msgHelper");

const Arcs = require("../../docs/data/Arcs");
const Characters = require("../../docs/data/Characters");
const Emojis = require("../../docs/data/Emojis");
const Items = require("../../docs/data/Items");
const Positions = require("../../docs/data/Positions");

module.exports = class InfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "info",
      aliases: [],
      group: "game",
      memberName: "info",
      description: "Claim your daily reward.",
      examples: [`${client.commandPrefix}daily`],
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
    if (!player.characters_Owned.hasOwnProperty(char)) return
    player.getCharProperty = getCharProperty;

    const [name, position, phase, weapon, level, EXP, Max_EXP, attributes] = [
      player.getCharProperty("name", msg),
      player.getCharProperty("position"),
      player.getCharProperty("phase"),
      player.getCharProperty("weapon"),
      player.getCharProperty("level"),
      player.getCharProperty("EXP"),
      player.getCharProperty("Max_EXP"),
      player.getCharProperty("attributes"),
    ]

    const stars = `${"⭐".repeat(phase)}${emoji(msg, "empty_star").repeat(
      6 - phase
    )}`;

    const messageEmbed = new MessageEmbed()
      .setTitle(`${name} ${Positions[position].emoji}` + `\n${stars}`)
      .setImage(msg.author.displayAvatarURL());
    var description = `Weapon: ${weapon}\n`;
    description += `Level ${level}/${(phase + 1) * 20}\n`;
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
