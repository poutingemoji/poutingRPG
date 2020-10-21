//BASE
const { Command } = require("discord.js-commando");
const BaseHelper = require("../../Base/Helper");
const { aggregation } = require("../../Base/Util");

//DATA
const positions = require("../../pouting-rpg/data/positions");

// UTILS
const { Game } = require("../../DiscordBot");
const enumHelper = require("../../utils/enumHelper");

module.exports = class InfoCommand extends aggregation(Command, BaseHelper) {
  constructor(client) {
    super(client, {
      name: "info",
      group: "game",
      memberName: "info",
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
    this.Discord = Game.Discord;
    this.Game = Game;
  }

  async run(msg, { characterName }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    console.log(characterName)
    if(isNaN(characterName)) {
      characterName = this.titleCase(characterName)
    } else {
      characterName = Array.from(player.characters.keys())[
        characterName - 1
      ]
    }
    if (!player.characters.get(characterName)) return;

    const {
      name,
      positionName,
      rarity,
      level,
      exp,
      constellation,
      attributes,
    } = await this.Game.getCharacterProps(characterName, player);
    const isMC = enumHelper.isMC(characterName);
    console.log(rarity)
    const data = {
      [`${stars(this.Discord, rarity)}`]: "",
      [`*[${exp.current}/${exp.total} EXP]*`]: "",
      [constellation]: "",
      ["Position"]: `${this.Discord.emoji(positionName)} ${positionName}`,
    };
    for (const attributeName in attributes) {
      data[attributeName.replace(/_/g, " ")] = attributes[attributeName];
    }

    const params = {
      title: `${name} | Level ${level}/${(rarity + 1) * 20}\n`,
      description: this.objectToString(data),
    };

    if (isMC) {
      params.image = msg.author.displayAvatarURL();
    } else {
      //prettier-ignore
      params.filePath = `./images/characters/${characterName.replace(" ", "_")}.png`
    }
    const messageEmbed = this.Discord.buildEmbed(params);
    //`Weapon: ${weapon}\n`;
    msg.say(messageEmbed);
  }
};

function stars(Discord, rarity) {
  return `${"⭐".repeat(rarity)}${Discord.emoji("empty star").repeat(
    5 - rarity
  )}`;
}
