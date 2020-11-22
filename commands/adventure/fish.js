//BASE
const Command = require("../../Base/Command");

//DATA
const items = require("../../pouting-rpg/data/items");

module.exports = class FishCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "fish",
      group: "adventure",
      memberName: "fish",
      description: "Do your fishing.",
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

    const itemFilter = (item) => {
      return item.type == "Fish";
    };

    this.Game.Database.addExpToPlayer(player, 132, msg);
    //this.Game.Database.addValueToPlayer(player, "points", 5)
    const fishName = this.Game.roguelike(items, 1, itemFilter);
    this.Game.Database.addItem(player, fishName);
    msg.reply(`You fished out: **${fishName} ${items[fishName].emoji}** !`);
  }
};
