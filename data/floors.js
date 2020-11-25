const items = require("./items")
const floors = [
  //Floor 1
  {
    hunt: [],
    harvest: [],
    fish: [],
    mine: [items["copperChunk"], items["ironChunk"], items["suspendiumChunk"]],
    areas: [
      {
        name: "Shinsu Tank",
        waves: [
          {
            whiteSteelEel: 1,
            ball: 1,
          },
          {
            whiteSteelEel: 1,
            ball: 1,
          },
        ]
      },
    ]
  },
];

module.exports = floors;
