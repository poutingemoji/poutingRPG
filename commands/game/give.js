require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const { giveCharWeapon } = require("../../database/functions");

const Items = require("../../docs/data/Items");

module.exports = class GiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "give",
      aliases: [],
      group: "game",
      memberName: "give",
      description: "Give your character a weapon.",
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "weapon",
          prompt: `What weapon would you like to give to the selected character?`,
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { weapon }) {
    const player = await findPlayer(msg.author, msg);
    player.giveCharWeapon = giveCharWeapon
    player.giveCharWeapon(weapon)
  }
};
