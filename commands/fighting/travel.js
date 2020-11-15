//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../pouting-rpg/data/arcs");
const floors = require("../../pouting-rpg/data/floors");

//UTILS

module.exports = class TravelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "travel",
      group: "fighting",
      memberName: "travel",
      description: "travel enemies.",
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = (floor, i) => {
      return `Floor ${i+1}\n`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        title: "Floors",
        msg,
      },
      formatFilter,
      floors
    );
  }
};
