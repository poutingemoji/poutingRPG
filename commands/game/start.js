//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA
const factions = require("../../pouting-rpg/data/factions");

// UTILS
const { Game } = require("../../DiscordBot");
const Pagination = require("../../utils/discord/Pagination");

module.exports = class StartCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "start",
      aliases: [],
      group: "game",
      memberName: "start",
      description: "Start your adventure.",
      examples: [],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    console.log(player);
    if (!player) return;

    var description = "Choose between the factions below:\n";
    for (const faction of Object.keys(factions)) {
      description += `${this.Discord.emoji(
        faction
      )} - **${faction}**\n${faction} favours ${factions[
        faction
      ].favoured_positions.join(" and ")}.\n`;
    }

    msg
      .reply(description)
      .then(async (msgSent) => {
        const faction = await this.Discord.awaitResponse({
          type: "reaction",
          author: msg.author.id,
          msg: msgSent,
          chooseFrom: factions,
        });
        this.Game.Database.createNewPlayer(msg.author.id, faction);
        msg.say(
          `${this.Discord.emoji(factions[faction].leader)} **${
            factions[faction].leader
          }**: ${msg.author}, ${joinedFactionMsg[faction]}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const joinedFactionMsg = {
  ["Zahard"]:
    "I'll give you the privilege of joining my empire, the correct choice was pretty obvious wasn't it?",
  ["FUG"]:
    "We're not nice people, I hope you can handle the difficult training in FUG.",
  ["Wolhaiksong"]:
    "Glad you made the right choice baby, welcome to Wolhaiksong!",
};
