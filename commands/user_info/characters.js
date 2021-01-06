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
      args: [
        {
          key: "filter",
          prompt: `What would you like to filter by?`,
          type: "string",
          oneOf: ["volume", "position"],
          default: "volume",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { filter }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = async (characterId) => {
      const character = this.Game.getObjectStats(player, characterId);
      const { weapon, offhand } = character.equipment;
      return `${this.Discord.emoji(character.position.emoji)} **${
        character.name
      }** (Lv.${character.level.current}) | ${this.Discord.emoji(
        weapon.emoji
      )} ${weapon.name} +${weapon.baseStats.ATK} | ${this.Discord.emoji(
        offhand.emoji
      )} ${offhand.name} +${offhand.baseStats.HP}`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Characters",
      },
      formatFilter,
      groupBy(
        Array.from(player.characters.keys()),
        filter == "volume"
          ? (characterId) => `Volume ${characters[characterId].volume}`
          : (characterId) => characters[characterId].position.name
      )
    );
  }
};
