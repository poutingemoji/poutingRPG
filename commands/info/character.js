//BASE
const Command = require("../../Base/Command");

//DATA
const positions = require("../../pouting-rpg/data/positions");

// UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class CharacterCommand extends Command {
  constructor(client) {
    super(client, {
      name: "character",
      aliases: ["char"],
      group: "info",
      memberName: "character",
      description: "Get info on your character.",
      examples: [],
      args: [
        {
          key: "characterName",
          prompt: `What character would you like to get more info on?`,
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

    //prettier-ignore
    isNaN(characterName) 
    ? characterName = this.titleCase(characterName) 
    : characterName = player.characters[characterName - 1];

    const character = player.characters.includes(characterName);
    if (!character) return;

    const {
      name,
      positionName,
      rarity,
      baseStats,
    } = await this.Game.Database.getCharacterProperties(player, characterName);

    const data = {};
    for (const baseStat in baseStats) {
      data[baseStat.replace(/_/g, " ")] = baseStats[baseStat];
    }
    data["Talent"] =
      "yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.";
    data[`${this.Discord.progressBar(rarity / 5, 5, "⭐", "empty_star")}`] = "";

    const params = {
      title: `${this.Discord.emoji(positionName)} ${name}`,
      description: this.objectToString(data),
    };

    //prettier-ignore
    enumHelper.isMC(characterName) 
    ? params.image = msg.author.displayAvatarURL() 
    : params.filePath = `./images/characters/${characterName.replace(" ", "_")}.png`

    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
