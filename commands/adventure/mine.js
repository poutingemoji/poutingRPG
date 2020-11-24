//BASE
const Command = require("../../Base/Command");

//DATA
const items = require("../../poutingRPG/data/items");

//prettier-ignore
module.exports = class MineCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mine",
      group: "adventure",
      memberName: "mine",
      description: "Do your mining.",
      throttling: {
        usages: 10,
        duration: 86400,
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
      return item.type == "Chunk";
    };
    const chunkId = this.Game.roguelike(items, 1, itemFilter);
    const chunk = items[chunkId]
    this.Game.Database.addItem(player, chunkId);
    msg.reply(`You mined: **${chunk.name} ${this.Discord.emoji(chunk.emoji)}** !`);
  }
};
