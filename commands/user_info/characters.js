//BASE
const Command = require("../../Base/Command");

//DATA
const characters = require("../../data/characters");
const items = require("../../data/items");
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
      const character = this.Game.getCharacter(player, characterId);
      const weapon = this.Game.getEquipment(character.weapon);
      const offhand = this.Game.getEquipment(character.offhand);
      return `${this.Discord.emoji(character.position.emoji)} ${
        character.name
      } (Lv.${character.level.current}) | ${weapon.name} +${weapon.ATK} 🗡️ | ${
        offhand.name
      } +${offhand.HP} ❤️`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        msg,
        author: msg.author,
        title: "Characters",
      },
      formatFilter,
      this.groupBy(
        Array.from(player.characters.keys()),
        filter == "volume"
          ? (characterId) => `Volume ${characters[characterId].volume}`
          : (characterId) => characters[characterId].position.name
      )
    );
  }
};
