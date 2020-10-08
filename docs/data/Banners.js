const { percentageChance } = require("../../utils/helpers/arrHelper");

const Characters = require("./Characters");
const Items = require("./Items");
const charactersAndItems = Object.assign({}, Characters, Items);

const filtered = Object.keys(charactersAndItems)
  .filter((key) => charactersAndItems[key].rarity > 2)
  .reduce((obj, key) => {
    obj[key] = charactersAndItems[key];
    return obj;
  }, {});

const Banners = [
  {
    name: "The Arsenal Of The King",
    banner: "",
    featuredCharacters: [],
    wish: function () {
      return percentageChance(
        Object.keys(filtered),
        Object.values(filtered).map((val) => Math.pow(5 - val.rarity, 2))
      );
    },
  },
];

module.exports = Banners;
