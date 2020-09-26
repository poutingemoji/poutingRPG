const empty = [1, 0.8, 1.4, 1.2]

const pets = {
  whitesteeleel: {
    name: "White Steel Eel",
    emoji: "🐋",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949507660218418/White_Steel_Eel.png",
    empty: {
      hunger: 19500*empty[0],
      hygiene: 19500*empty[1],
      fun: 19500*empty[2],
      energy: 19500*empty[3],
    },
    exprate: "mediumfast",
    price: 10000,
  },
  zygaena: {
    name: "Zygaena",
    emoji: "🐮",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949509799051434/Zygaena.png",
    empty: {
      hunger: 21000*empty[3],
      hygiene: 21000*empty[0],
      fun: 21000*empty[1],
      energy: 21000*empty[2],
    },
    exprate: "mediumfast",
    price: 20000,
  },
  shadowfox: {
    name: "Shadow Fox",
    emoji: "🦊",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949501716889630/Shadow_Fox.png",
    empty: {
      hunger: 22500*empty[2],
      hygiene: 22500*empty[3],
      fun: 22500*empty[0],
      energy: 22500*empty[1],
    },
    exprate: "mediumfast",
    price: 30000,
  },
  fenryl: {
    name: "Fenryl",
    emoji: "🐺",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949625255919616/Fenryl.png",
    empty: {
      hunger: 24000*empty[1],
      hygiene: 24000*empty[2],
      fun: 24000*empty[3],
      energy: 24000*empty[0],
    },
    exprate: "mediumfast",
    price: 40000,
  },
  octocrab: {
    name: "Octo-Crab",
    emoji: "🦀",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949492191363112/Octo_Crab.png",
    empty: {
      hunger: 25500*empty[0],
      hygiene: 25500*empty[1],
      fun: 25500*empty[2],
      energy: 25500*empty[3],
    },
    exprate: "mediumfast",
    price: 50000,
  },
  submergedfish: {
    name: "Submerged Fish",
    emoji: "🐬",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949505747615884/Submerged_Fish.png",
    empty: {
      hunger: 27000*empty[3],
      hygiene: 27000*empty[0],
      fun: 27000*empty[1],
      energy: 27000*empty[2],
    },
    exprate: "mediumfast",
    price: 60000,
  },
  pollack: {
    name: "Pollack",
    emoji: "🐸",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949493193801758/Pollack.png",
    empty: {
      hunger: 28500*empty[2],
      hygiene: 28500,
      fun: 28500*empty[0],
      energy: 28500*empty[1],
    },
    exprate: "mediumfast",
    price: 70000,
  },
  sixwingedwindbird: {
    name: "Six-Winged Windbird",
    emoji: "🦅",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949503704989716/Six-Winged_Giant_Windbird.png",
    empty: {
      hunger: 30000*empty[1],
      hygiene: 30000*empty[2],
      fun: 30000*empty[3],
      energy: 30000*empty[0],
    },
    exprate: "mediumfast",
    price: 80000,
  },
  giantcat: {
    name: "Giant Cat",
    emoji: "🐱",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949955288793158/Giant_Cat.png",
    empty: {
      hunger: 31500*empty[0],
      hygiene: 31500*empty[1],
      fun: 31500*empty[2],
      energy: 31500*empty[3],
    },
    exprate: "mediumfast",
    price: 90000,
  },
  ancientoddeyedcobra: {
    name: "Ancient Odd-Eyed Cobra",
    emoji: "🐍",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747950112449233136/Ancient_Odd-Eyed_Giant_Cobra.png",
    empty: {
      hunger: 33000*empty[3],
      hygiene: 33000*empty[0],
      fun: 33000*empty[1],
      energy: 33000*empty[2],
    },
    exprate: "mediumfast",
    price: 100000,
  },
  treasureeatingstingray: {
    name: "Treasure Eating Stingray",
    emoji: "🏴‍☠️",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949506791866418/Treasure_Eating_Stingray.png",
    empty: {
      hunger: 34500*empty[2],
      hygiene: 34500*empty[3],
      fun: 34500*empty[0],
      energy: 34500*empty[1],
    },
    exprate: "mediumfast",
    price: 110000,
  },
  killerwhale: {
    name: "Killer Whale",
    emoji: "🦈",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/747949489138040952/Killer_Whale.png",
    empty: {
      hunger: 36000*empty[1],
      hygiene: 36000*empty[2],
      fun: 36000*empty[3],
      energy: 36000*empty[0],
    },
    exprate: "mediumfast",
    price: 120000,
  },
};

module.exports = pets;
