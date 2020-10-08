require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");

const { emoji, stars } = require("../../utils/helpers/msgHelper");
const { titleCase } = require("../../utils/helpers/strHelper");

const Banners = require("../../docs/data/Banners");
const Characters = require("../../docs/data/Characters");
const { positions } = require("../../docs/data/Emojis");
const Items = require("../../docs/data/Items");

module.exports = class WishCommand extends Command {
  constructor(client) {
    super(client, {
      name: "wish",
      aliases: [],
      group: "game",
      memberName: "wish",
      description: "Roll for characters and weapons.",
      examples: [],
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

  async run(msg, { weapon }) {
    const player = await findPlayer(msg.author, msg);
    console.log(player)
    var description = `${emoji(
      msg,
      "loading"
    )} You wish upon the stars and receive...\n`;
    msg.say(description).then((msgSent) => {
      msg
        .say("https://tenor.com/view/anime-stars-night-gif-6118173")
        .then((gif) => {
          setTimeout(function () {
            const id = Banners[0].wish();
            const item = Items[id];
            console.log(Characters);
            gif.delete();
            msgSent.edit(
              `+1 ${item.name} ${positions[item.position]}\n${stars(
                msg,
                item.rarity
              )} (${
                Characters.hasOwnProperty(id)
                  ? "Character"
                  : titleCase(item.type)
              })`
            );
          }, 3500);
        });
    });
  }
};
