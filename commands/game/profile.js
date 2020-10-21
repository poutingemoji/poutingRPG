//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

const dateFormat = require("dateformat");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class ProfileCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "profile",
      group: "game",
      memberName: "profile",
      description: "View someone's profile.",
      examples: [`${client.commandPrefix}profile [@user/id]`],
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
      guildOnly: true,
    });
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg, { user }) {
    user = user || msg.author;
    const player = await this.Game.findPlayer(user, msg);
    const arc = arcs[player.arc];
    const data = {
      ["Adventure Rank"]: player.adventureRank.current,
      [`*[${player.exp.current}/${player.exp.total} EXP]*`]: "",
      [`${this.Discord.emoji("point")} Points`]: player.points,
      [`${this.Discord.emoji("dallar")} Dallars`]: player.dallars,
      [`${this.Discord.emoji("suspendium")} Suspendium`]: player.suspendium,
      [`${this.Discord.emoji(player.faction)} Faction`]: player.faction,
    };

    const messageEmbed = this.Discord.buildEmbed({
      thumbnail: user.displayAvatarURL(),
      title: "Profile",
      author: user,
      description: this.objectToString(data),
      footer: `Born: ${dateFormat(
        player._id.getTimestamp(),
        "dddd, mmmm dS, yyyy, h:MM TT"
      )}`,
    });
    msg.say(messageEmbed);
  }
};
