require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { numberWithCommas } = require("../../utils/helpers/intHelper");
const {
  maxHealth,
  maxEnergy,
  colors,
} = require("../../utils/helpers/enumHelper");

const Arcs = require("../../docs/data/Arcs");
const Emojis = require("../../docs/data/Emojis");
const Families = require("../../docs/data/Families");
const Positions = require("../../docs/data/Positions");
const Races = require("../../docs/data/Races");

const dateFormat = require("dateformat");

module.exports = class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      aliases: [],
      group: "game",
      memberName: "profile",
      description: "View someone's profile.",
      examples: [`${client.commandPrefix}profile [@user/id]`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: `Who's profile would you like to see?`,
          type: "user",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await findPlayer(user, msg);
    const arc = Arcs[player.arc];
    const profile = {
      ["Level"]: player.level,
      ["EXP"]: `${player.EXP}/${player.Max_EXP}`,
    };
    var description = "";

    for (var key in profile) {
      description += `${key}: **${profile[key]}**\n`;
    }

    const messageEmbed = new MessageEmbed()
      .setTitle(`${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(description)
      .setFooter(
        `Born: ${dateFormat(
          player._id.getTimestamp(),
          "dddd, mmmm dS, yyyy, h:MM TT"
        )}`
      );
    msg.say(messageEmbed);
  }
};
