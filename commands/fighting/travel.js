//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../data/arcs");
const floors = require("../../data/floors");

//UTILS

module.exports = class TravelCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "travel",
      group: "fighting",
      memberName: "travel",
      description: "Travel to an area of the Tower.",
      args: [
        {
          key: "floorId",
          prompt: `What floor would you like to travel to?`,
          type: "integer",
          default: false,
        },
        {
          key: "areaId",
          prompt: `What area would you like to travel to?`,
          type: "integer",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { floorId, areaId }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const allTowerProgression = player.progression.tower.total;
    const curTowerProgression = player.progression.tower.current;
    const formatFilter = (floor, i) => {
      return `**Floor ${i + 1}**\n${floor.areas
        .map(
          (area, j) =>
            `${j + 1}) ${area.name}${
              i == curTowerProgression.floor && j == curTowerProgression.area
                ? " 📌"
                : ""
            }${
              area.hasOwnProperty("harvestingSpot")
                ? "\n:rock: *Harvesting Spot*"
                : ""
            }`
        )
        .join("\n")}`;
    };
    if (floorId && areaId) {
      floorId--;
      areaId--;
      if (typeof floors[floorId].areas[areaId] == "undefined") return;
      if (allTowerProgression.floor < floorId) return;
      if (
        allTowerProgression.floor == floorId &&
        allTowerProgression.area < areaId
      )
        return;
      curTowerProgression.floor = floorId;
      curTowerProgression.area = areaId;
      this.Game.Database.savePlayer(player);
    } else if (floorId === false && areaId === false) {
      this.Discord.Pagination.buildEmbeds(
        {
          msg,
          author: msg.author,
          title: "Tower",
          startingIndex: curTowerProgression.floor,
          pageLength: 1,
          globalNumbering: true,
        },
        formatFilter,
        floors
      );
    }
  }
};
