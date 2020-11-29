//BASE
const Command = require("../../Base/Command");

//DATA
const items = require("../../data/items");

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
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const itemFilter = (item) => {
      return item.type == "chunk";
    };
    const chunkId = this.Game.roguelike(items, 1, itemFilter);
    const chunk = items[chunkId]
    return console.log(chunk)
    this.Game.addItem(player, chunkId);
    msg.reply(`You mined: **${chunk.name} ${this.Discord.emoji(chunk.emoji)}** !`);
  }
};
