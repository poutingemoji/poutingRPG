//BASE
const Command = require("../../Base/Command");

//DATA
const floors = require("../../data/floors");
const items = require("../../data/items");

//UTILS
const { randomBetween } = require("../../utils/Helper");

module.exports = class HarvestCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "harvest",
      group: "adventure",
      memberName: "harvest",
      description: "Harvest resources from your current area.",
      throttling: {
        usages: 1,
        duration: 7200,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const curTowerProgression = player.progression.tower.current;
    const curTowerArea =
      floors[curTowerProgression.floor].areas[curTowerProgression.area];

    const drops = {};
    Object.keys(curTowerArea.harvestingSpot).map((itemId) => {
      const item = curTowerArea.harvestingSpot[itemId];
      drops[itemId] = randomBetween(item.min, item.max);
    });
    console.log(drops);
    msg.say(
      Object.keys(drops)
        .map(
          (dropId) =>
            `+${drops[dropId]} **${items[dropId].name}** ${this.Discord.emoji(
              items[dropId].emoji
            )}`
        )
        .join("\n")
    );
  }
};
