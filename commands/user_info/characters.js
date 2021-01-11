//BASE
const Command = require("../../Base/Command");

//DATA
const characters = require("../../data/characters");
const items = require("../../data/items");

//UTILS
const { groupBy } = require("../../utils/Helper");
module.exports = class CharactersCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: ["chars"],
      group: "user_info",
      memberName: "characters",
      description: "View your characters.",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = async (characterId) => {
      const character = player.characters.get(characterId);
      console.log("CHARACTER", character);
      return `${this.Discord.emoji(character.constructor.name)} **${
        character.name
      }** (Lv.${character.level.current})`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Characters",
      },
      formatFilter,
      Array.from(player.characters.keys())
    );
  }
};
