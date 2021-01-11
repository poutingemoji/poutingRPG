const {
  Anemo,
  Geo,
  Electro,
  Dendro,
  Hydro,
  Pyro,
  Cryo,
} = require("../utils/game/Character");
const { convertArrayToObject } = require("../utils/Helper");

module.exports = convertArrayToObject([
  new Anemo({
    id: "traveler",
    rarity: 4,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "foreignIronwind",
      skill: "palmVortex",
      burst: "gustSurge",
      passives: [],
    },
    weaponId: "dullBlade",
  }),
]);
