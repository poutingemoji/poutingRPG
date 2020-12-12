//DATA
const emojis = require("./emojis");
const items = require("./items");
const positions = require("./positions");
const talents = require("./talents");

const characters = {
  twentyFifthBaam: {
    name: "Twenty-Fifth Baam",
    emoji: "",
    position: positions["waveController"],
    volume: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["needle"],
    offhand: items["armorInventory"],
  },
  khunAgueroAgnis: {
    name: "Khun Aguero Agnis",
    emoji: "",
    position: positions["lightBearer"],
    volume: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["needle"],
    offhand: items["armorInventory"],
  },
  rakWraithraiser: {
    name: "Rak Wraithraiser",
    emoji: "",
    position: positions["spearBearer"],
    volume: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["needle"],
    offhand: items["armorInventory"],
  },
  androssiZahard: {
    name: "Androssi Zahard",
    emoji: "",
    position: positions["fisherman"],
    volume: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["needle"],
    offhand: items["armorInventory"],
  },
  shipLeesoo: {
    name: "Ship Leesoo",
    emoji: "",
    position: positions["scout"],
    volume: 1,
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["needle"],
    offhand: items["armorInventory"],
  },
  kingZahard: {
    name: "King Zahard",
    emoji: emojis["king_zahard"],
  },
  khelHellam: {
    name: "Khel Hellam",
    emoji: emojis["khel_hellam"],
  },
  urekMazino: {
    name: "Urek Mazino",
    emoji: emojis["urek_mazino"],
  },
};
module.exports = characters;
