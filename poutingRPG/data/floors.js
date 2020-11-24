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
            ["White Steel Eel"]: 1,
            ["Ball"]: 1,
          },
          {
            ["White Steel Eel"]: 1,
            ["Ball"]: 1,
          },
        ]
      },
    ]
  },
];

module.exports = floors;
