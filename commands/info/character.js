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
          default: "Traveller",
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

    if (isNaN(characterName)) {
      characterName = this.titleCase(characterName);
    } else {
      characterName = Array.from(player.characters.keys())[characterName - 1];
    }
    const character = player.characters.get(characterName);
    if (!character) return;
    this.Game.Database.passiveRegenCharacter(player, characterName);
    const {
      name,
      positionName,
      rarity,
      level,
      exp,
      constellation,
      baseStats,
    } = await this.Game.Database.getCharacterProperties(player, characterName);
    const isMC = enumHelper.isMC(characterName);
    const HPRegenTimeFormat = this.secondsToTimeFormat(
      ((character.HP.total - character.HP.current) / character.HP.total) *
        enumHelper.timeUntilFull.HP
    );
    const data = {
      [`*[${exp.current}/${exp.total} EXP]*`]: "",
      [constellation]: "",
      [`${Math.floor(character.HP.current)}**/${character.HP.total}** ❤ ${
        HPRegenTimeFormat !== "" ? `(${HPRegenTimeFormat})` : ""
      }`]: "",
    };
    for (const baseStat in baseStats) {
      data[baseStat.replace(/_/g, " ")] = baseStats[baseStat];
    }
    data["Talent"] = "yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes.yes."
    data[`${this.Discord.progressBar(rarity / 5, 5, "⭐", "empty_star")}`] = "";
    const params = {
      title: `${this.Discord.emoji(positionName)} ${name} | Level ${
        level.current
      }/${level.total}\n`,
      description: this.objectToString(data),
    };

    if (isMC) {
      params.image = msg.author.displayAvatarURL();
    } else {
      //prettier-ignore
      params.filePath = `./images/characters/${characterName.replace(" ", "_")}.png`
    }
    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};
