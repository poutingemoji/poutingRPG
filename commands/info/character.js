//BASE
const { Command } = require("discord.js-commando");

//DATA
const positions = require("../../pouting-rpg/data/positions");

// UTILS
const { Game, Discord } = require("../../DiscordBot");
const enumHelper = require("../../utils/enumHelper");
const Helper = require("../../utils/Helper");

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
    this.Discord = Discord;
    this.Game = Game;
  }

  async run(msg, { characterName }) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;
    
    console.log(characterName)
    if(isNaN(characterName)) {
      characterName = Helper.titleCase(characterName)
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
      [`${this.Discord.stars(rarity)}`]: "",
      [`*[${exp.current}/${exp.total} EXP]*`]: "",
      [constellation]: "",
      ["Position"]: `${positionName} ${this.Discord.emoji(positionName)}`,
    };
    for (const attributeName in attributes) {
      data[attributeName.replace(/_/g, " ")] = attributes[attributeName];
    }

    const params = {
      title: `${name} | Level ${level}/${(rarity + 1) * 20}\n`,
      description: Helper.objectToString(data),
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
