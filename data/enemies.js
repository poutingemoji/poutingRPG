const { Boss, Special } = require("../utils/game/Enemy");
const { convertArrayToObject } = require("../utils/Helper");

module.exports = convertArrayToObject([
  new Boss({
    id: "mitachurl",
    rarity: 5,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "foreignIronwind",
      skill: "palmVortex",
      burst: "gustSurge",
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
  new Boss({
    id: "hilichurl",
    rarity: 1,
    HP: 50,
    ATK: 0,
    talentIds: {
      attack: "foreignIronwind",
      skill: "palmVortex",
      burst: "gustSurge",
    },
    drops: { copperChunk: 4, ironChunk: 69 },
  }),
]);
