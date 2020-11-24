//BASE
const Command = require("../../Base/Command");

//DATA

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
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
    this.Discord = this.getDiscord();
    this.Game = this.getGame();
  }

  async run(msg) {
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    const formatFilter = async (characterId) => {
      console.log(characterId)
      //prettier-ignore
      const character
      = await this.Game.Database.getCharacter(player, characterId);
      console.log(character)
      return `${character.name} ${this.Discord.emoji(character.positionId)}`;
    };

    this.Discord.Pagination.buildEmbeds(
      {
        title: "Characters",
        author: msg.author,
        msg,
      },
      formatFilter,
      player.characters
    );
  }
};
