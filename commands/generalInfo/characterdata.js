//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

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
    // ${this.Discord.progressBar(character.rarity / 5, 5, "⭐", "empty_star")}
    //prettier-ignore
    console.log(character)
    //prettier-ignore
    const params = {
      title: `${this.Discord.emoji(character.position.emoji)} ${character.name}`,
      description: stripIndents(`
      ${Object.keys(character.baseStats).map(baseStatId => `**${baseStatId}**: ${character.baseStats[baseStatId]}`).join("\n")}
      ${Object.keys(character.talents).map(
        (talentType) =>  `${this.Discord.emoji(enumHelper.talentTypes[talentType].emoji)} **${character.talents[talentType].name}**: ${character.talents[talentType].description}`
        ).join("\n")}`),
    };

    //prettier-ignore
    enumHelper.isProtagonist(characterId) 
    ? params.image = msg.author.displayAvatarURL() 
    : params.filePath = `./images/characters/${characterId.replace(" ", "_")}.png`

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
