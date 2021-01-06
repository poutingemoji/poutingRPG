const items = require("./items");
class Area {
  constructor({ name, waves, harvestingSpot }) {
    this.name = name;
    this.waves = waves;
    this.harvestingSpot = harvestingSpot;
  }
}

module.exports = [
  //Floor 1
  {
    areas: [
      new Area({
        name: "Shinsu Tank",
        waves: [
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
      }),
    ],
  },
  {
    areas: [
      new Area({
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
      }),
      new Area({
        name: "Shinsu Tank 2",
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
      }),
      new Area({
        name: "Shinsu Tank 3",
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
      }),
    ],
  },
];
