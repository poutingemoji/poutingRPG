//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const { MessageEmbed } = require("discord.js");

//DATA
require("dotenv").config();

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class InfoCommand extends aggregation(Command, BaseHelper) {
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
    const [
      name,
      position,
      rarity,
      weapon,
      level,
      current_exp,
      total_exp,
      attributes,
    ] = [
      player.getCharProperty("name", msg),
      player.getCharProperty("position"),
      player.getCharProperty("rarity"),
      player.getCharProperty("weapon"),
      player.getCharProperty("level"),
      player.getCharProperty("current_exp"),
      player.getCharProperty("total_exp"),
      player.getCharProperty("attributes"),
    ];

    const messageEmbed = new MessageEmbed()
      .setTitle(`${name} ${positions[position]}\n` + `${stars(msg, rarity)}`)
      .setImage(msg.author.displayAvatarURL());
    let description = `Weapon: ${weapon}\n`;
    description += `Level ${level}/${(rarity + 1) * 20}\n`;
    description += `EXP: ${current_exp}/${total_exp}\n\n`;
    for (let attribute in attributes) {
      description += `${attribute.replace(/_/g, " ")}: ${
        attributes[attribute]
      }\n`;
    }

    messageEmbed.setDescription(description);
    msg.say(messageEmbed);
  }
};
