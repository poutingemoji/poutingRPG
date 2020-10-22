//BASE
const { Command } = require("discord.js-commando");

//DATA

// UTILS
const { Game, Discord } = require("../../DiscordBot");
const Helper = require("../../utils/Helper");

module.exports = class CharactersCommand extends 
  Command {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: ["chars"],
      group: "storage",
      memberName: "characters",
      description: "View your characters.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    console.log(player);
    if (!player) return;

    const charactersOwned = Array.from(player.characters.keys());

    const formatFilter = async (characterName) => {
      //prettier-ignore
      const { name, positionName, level, constellation } 
      = await this.Game.getCharacterProps(characterName, player);
      return `**${name}** ${this.Discord.emoji(
        positionName
      )} | Level: ${level} | ${constellation}`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        title: "Characters",
        author: msg.author,
        msg,
      },
      formatFilter,
      charactersOwned
    );
  }
};
