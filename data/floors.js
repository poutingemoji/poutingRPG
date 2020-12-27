const items = require("./items");
const floors = [
  //Floor 1
  {
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
        ],
        harvestingSpot: {
          suspendium: {
            min: 1,
            max: 3,
          },
          orange: {
            min: 1,
            max: 2,
          },
        },
      },
      {
        name: "Shinsu Tank2",
        waves: [
          {
            whiteSteelEel: 1,
            ball: 1,
          },
          {
            whiteSteelEel: 1,
            ball: 1,
          },
        ],
      },
      {
        name: "Shinsu Tank3",
        waves: [
          {
            whiteSteelEel: 1,
            ball: 1,
          },
          {
            whiteSteelEel: 1,
            ball: 1,
          },
        ],
      },
    ],
  },

  {
    harvestingSpot: [items["suspendium"]],
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
        ],
      },
      {
        name: "Shinsu Tank2",
        waves: [
          {
            whiteSteelEel: 1,
            ball: 1,
          },
          {
            whiteSteelEel: 1,
            ball: 1,
          },
        ],
      },
      {
        name: "Shinsu Tank3",
        waves: [
          {
            whiteSteelEel: 1,
            ball: 1,
          },
          {
            whiteSteelEel: 1,
            ball: 1,
          },
        ],
      },
    ],
  },
];

module.exports = floors;
