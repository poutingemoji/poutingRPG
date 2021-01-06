const {
  WaveController,
  LightBearer,
  SpearBearer,
  Fisherman,
  Scout,
} = require("../utils/game/Character");
const emojis = require("./emojis");
module.exports = {
  twentyFifthBaam: new WaveController({
    rarity: 4,
    name: "Twenty-Fifth Baam",
    emoji: emojis["twenty_fifth_baam"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  khunAgueroAgnis: new LightBearer({
    rarity: 4,
    name: "Khun Aguero Agnis",
    emoji: emojis["khun_aguero_agnis"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  rakWraithraiser: new SpearBearer({
    rarity: 4,
    name: "Rak Wraithraiser",
    emoji: emojis["rak_wraithraiser"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  androssiZahard: new Fisherman({
    rarity: 4,
    name: "Androssi Zahard",
    emoji: emojis["androssi_zahard"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  shipLeesoo: new Scout({
    rarity: 4,
    name: "Ship Leesoo",
    emoji: emojis["ship_leesoo"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  kingZahard: new Scout({
    rarity: 4,
    name: "King Zahard",
    emoji: emojis["king_zahard"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  karaka: new Scout({
    rarity: 4,
    name: "Karaka",
    emoji: emojis["karaka"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
  urekMazino: new Scout({
    rarity: 4,
    name: "Urek Mazino",
    emoji: emojis["urek_mazino"],
    season: 1,
    HP: 100,
    ATK: 100,
    talentIds: {
      attack: "shinsuBlast",
      support: "shinsuAura",
    },
    equipmentIds: {
      weapon: "needle",
      offhand: "armorInventory",
    },
  }),
};

/*
  SPECIAL POSITIONS
  Guides
  Anima
  Jeonsulsa
  Hwayeomsa
  targeted
  Unknown Position
  */
