const { percentageChance } = require("../../utils/helpers/arrHelper");

const Characters = require("./characters");
const Items = require("./items");
const charactersAndItems = Object.assign({}, Characters, Items);

const filtered = Object.keys(charactersAndItems)
  .filter((key) => charactersAndItems[key].rarity > 2)
  .reduce((obj, key) => {
    obj[key] = charactersAndItems[key];
    return obj;
  }, {});

const banners = [
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

module.exports = banners;
