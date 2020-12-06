//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");
const { createCanvas, loadImage } = require("canvas");

const fs = require("fs");
//DATA
const items = require("../../data/items");

// UTILS
const enumHelper = require("../../utils/enumHelper");

module.exports = class CharDataCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "chardata",
      group: "user_info",
      memberName: "chardata",
      description: "Shows information on a character.",
      examples: [],
      args: [
        {
          key: "characterId",
          prompt: `What character would you like to get information on?`,
          type: "string",
          default: "twentyFifthBaam",
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
    //prettier-ignore
    if (!isNaN(characterId)) characterId = Array.from(player.characters.keys())[characterId - 1];
    const character = this.Game.getCharacter(player, characterId);
    if (!character) return;
    const { weapon, offhand } = this.Game.getEquipment(character);

    //prettier-ignore
    const params = {
      title: `${this.Discord.emoji(character.position.emoji)} ${character.name}`,
      description: stripIndents(`
      ❤️ **HP**: ${character.baseStats.HP} + ${offhand.HP}
      🗡️ **ATK**: ${character.baseStats.ATK} + ${weapon.ATK}
      **Weapon**: ${weapon.name} ${this.Discord.emoji(weapon.emoji)}
      **Offhand**: ${offhand.name} ${this.Discord.emoji(offhand.emoji)}
      
      __Talents__
      ${Object.keys(character.talents).map(
        (talentType) =>  `${this.Discord.emoji(enumHelper.talentTypes[talentType].emoji)} **${character.talents[talentType].name}**: ${character.talents[talentType].description}`
        ).join("\n")}`),
    };

    const characterImage = await loadImage(`./images/characters/${characterId}.png`);
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");
    scaleToFit(canvas, ctx, characterImage);
    params.filePath = canvas.toBuffer();
    
    const messageEmbed = this.Discord.buildEmbed(params);
    msg.say(messageEmbed);
  }
};

function scaleToFit(canvas, ctx, img) {
  //Utilizing https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
  const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = canvas.width / 2 - (img.width / 2) * scale;
  const width = img.width * scale;
  const height = img.height * scale;
  ctx.drawImage(img, x, 0, width, height);
  return scale;
}
