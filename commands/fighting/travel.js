//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../data/arcs");
const floors = require("../../data/floors");

//UTILS

module.exports = class TravelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "travel",
      group: "fighting",
      memberName: "travel",
      description: "Travel to a floor of the Tower.",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = (floor, i) => {
      return `Floor ${i + 1}\n`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        title: "Floors",
      },
      formatFilter,
      floors
    );
  }
};
