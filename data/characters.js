//DATA
const emojis = require("./emojis");
const items = require("./items");
const positions = require("./positions");
const talents = require("./talents");

const characters = {
  irregular: {
    position: positions["fisherman"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["hook"],
    offhand: items["armorInventory"],
  },
  twentyFifthBaam: {
    name: "Twenty-Fifth Baam",
    emoji: "",
    position: positions["waveController"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["hook"],
    offhand: items["armorInventory"],
  },
  khunAgueroAgnis: {
    name: "Khun Aguero Agnis",
    emoji: "",
    position: positions["lightBearer"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["hook"],
    offhand: items["armorInventory"],
  },
  rakWraithraiser: {
    name: "Rak Wraithraiser",
    emoji: "",
    position: positions["spearBearer"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
    weapon: items["hook"],
    offhand: items["armorInventory"],
  },
  shipLeesoo: {
    name: "Ship Leesoo",
    emoji: "",
    position: positions["scout"],
    baseStats: {
      HP: 100,
      ATK: 100,
    },
    talents: {
      attack: positions["fisherman"].talents[0].attack,
      support: positions["fisherman"].talents[0].support,
    },
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
