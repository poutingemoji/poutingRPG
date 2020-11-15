//BASE
const Command = require("../../Base/Command");

//DATA

module.exports = class CharactersCommand extends Command {
  constructor(client) {
    super(client, {
      name: "characters",
      aliases: ["chars"],
      group: "user-info",
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

    const formatFilter = async (characterName) => {
      //prettier-ignore
      const { name, positionName } 
      = await this.Game.Database.getCharacter(player, characterName);
      return `${name} ${this.Discord.emoji(positionName)}`;
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
