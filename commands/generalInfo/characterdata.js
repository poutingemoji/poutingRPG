//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const positions = require("../../data/positions");
const talents = require("../../data/talents");

// UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class CharacterDataCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "characterdata",
      aliases: ["chardata"],
      group: "general_info",
      memberName: "characterdata",
      description: "Shows information on a character.",
      examples: [],
      args: [
        {
          key: "characterId",
          prompt: `What character would you like to get information on?`,
          type: "string",
          default: enumHelper.protagonist.id,
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg, { characterId }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    if (!isNaN(characterId)) player.characters[characterId - 1];
    let character = player.characters.get(characterId);
    if (!character) return;
    character = this.Game.getCharacter(player, characterId);

    //prettier-ignore
    const params = {
      title: `${this.Discord.emoji(character.position.emoji)} ${character.name}`,
      description: stripIndents(`
        HP: ${character.baseStats.HP}
        ATK: ${character.baseStats.ATK}
        ${this.Discord.progressBar(character.rarity / 5, 5, "⭐", "empty_star")}
      `),
    };

    //prettier-ignore
    enumHelper.isProtagonist(characterId) 
    ? params.image = msg.author.displayAvatarURL() 
    : params.filePath = `./images/characters/${characterId.replace(" ", "_")}.png`

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
