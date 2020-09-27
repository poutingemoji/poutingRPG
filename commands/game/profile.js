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

const arcs = require("../../docs/data/arcs.js");
const emojis = require("../../docs/data/emojis.js");
const families = require("../../docs/data/families.js");
const pets = require("../../docs/data/pets.js");
const positions = require("../../docs/data/positions.js");
const races = require("../../docs/data/races.js");

const dateFormat = require("dateformat");

module.exports = class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      aliases: [],
      group: "game",
      memberName: "profile",
      description: "Displays your profile.",
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
        duration: 5,
      },
    });
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await findPlayer(user, msg);
    const [family, race, pet, arc] = [
      families[player.family],
      races[player.race],
      pets[player.pet.id],
      arcs[player.arc],
    ];
    const profile = [
      {
        [`${family.emoji} Family`]: family.name,
        [`${race.emoji} Race`]: race.name,
        [`${emojis["positions"]} Positions`]: player.position
          .map((position) => positions[position].emoji)
          .join(", "),
      },
      {
        [`${emojis["level"]} Level`]: player.level,
        [`${emojis["exp"]} Exp`]: `${player.exp}/${player.expMax}`,
      },
      {
        [`${emojis["health"]} Health`]: `${player.health}/${maxHealth(
          player.level
        )}`,
        [`${emojis["energy"]} Energy`]: `${player.shinsu}/${maxEnergy(
          player.level
        )}`,
        [`${emojis["points"]} Points`]: numberWithCommas(player.points),
        [`${emojis["dallars"]} Dallars`]: numberWithCommas(player.dallars),
      },
      {
        [`${emojis["arc"]} Arc`]: arc.name,
        [`${emojis["chapter"]} Chapter`]: player.chapter + 1,
        [`${pet ? pet.emoji : "❓"} Pet`]: pet ? pet.name : "None",
        [`🏔️ Reputation`]: numberWithCommas(player.reputation),
      },
    ];

    var profileMessage = "";
    profile.forEach((category) => {
      profileMessage += `───────────────\n`;
      for (var key in category) {
        profileMessage += `${key}: **${category[key]}**\n`;
      }
    });
    const messageEmbed = new MessageEmbed()
      .setColor(colors.position[player.position[0]])
      .setTitle(`${user.username}'s Profile`)
      .setThumbnail(arc.image)
      .setDescription(profileMessage)
      .setFooter(
        `Born: ${dateFormat(
          player._id.getTimestamp(),
          "dddd, mmmm dS, yyyy, h:MM TT"
        )}`
      );
    msg.say(messageEmbed);
  }
};
