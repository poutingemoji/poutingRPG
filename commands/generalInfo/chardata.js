//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const positions = require("../../poutingRPG/data/positions");
const talents = require("../../poutingRPG/data/talents");

// UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class CharDataCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "chardata",
      group: "general_info",
      memberName: "chardata",
      description: "Shows all the information about a character.",
      examples: [],
      args: [
        {
          key: "characterName",
          prompt: `What character would you like to get information on?`,
          type: "string",
          default: "Irregular",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg, { characterName }) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    return msg.say(this.Discord.emoji("four_leaf_clover"))
    //prettier-ignore
    characterName = isNaN(characterName) ? this.titleCase(characterName) : player.characters[characterName - 1];
    let character = player.characters.get(characterName);
    if (!character) return;
    //prettier-ignore
    character = await this.Game.Database.getCharacter(player, characterName);

    const params = {
      title: `${this.Discord.emoji(character.positionName)} ${character.name}`,
      description: stripIndents(`
        HP: ${character.baseStats.HP}
        ATK: ${character.baseStats.ATK}
        ${this.Discord.progressBar(character.rarity / 5, 5, "⭐", "empty_star")}
      `),
    };

    //prettier-ignore
    enumHelper.isMC(characterName) 
    ? params.image = msg.author.displayAvatarURL() 
    : params.filePath = `./images/characters/${characterName.replace(" ", "_")}.png`

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
