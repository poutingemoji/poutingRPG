const {
  WaveController,
  LightBearer,
  SpearBearer,
  Fisherman,
  Scout,
} = require("../utils/game/Character");
const emojis = require("./emojis");
const items = require("./items");

const characters = {
  twentyFifthBaam: new WaveController({
    rarity: 4,
    name: "Twenty-Fifth Baam",
    emoji: emojis["twenty_fifth_baam"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  khunAgueroAgnis: new LightBearer({
    rarity: 4,
    name: "Khun Aguero Agnis",
    emoji: emojis["khun_aguero_agnis"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  rakWraithraiser: new SpearBearer({
    rarity: 4,
    name: "Rak Wraithraiser",
    emoji: emojis["rak_wraithraiser"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  androssiZahard: new Fisherman({
    rarity: 4,
    name: "Androssi Zahard",
    emoji: emojis["androssi_zahard"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  shipLeesoo: new Scout({
    rarity: 4,
    name: "Ship Leesoo",
    emoji: emojis["ship_leesoo"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  kingZahard: new Scout({
    rarity: 4,
    name: "King Zahard",
    emoji: emojis["king_zahard"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  karaka: new Scout({
    rarity: 4,
    name: "Karaka",
    emoji: emojis["karaka"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
  urekMazino: new Scout({
    rarity: 4,
    name: "Urek Mazino",
    emoji: emojis["urek_mazino"],
    volume: 1,
    HP: 100,
    ATK: 100,
    attackId: "shinsuBlast",
    supportId: "shinsuAura",
    weaponId: "needle",
    offhandId: "armorInventory",
  }),
};
module.exports = characters;

/*
  SPECIAL POSITIONS
  Guides
  Anima
  Jeonsulsa
  Hwayeomsa
  targeted
  Unknown Position
  */
