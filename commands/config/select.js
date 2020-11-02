//BASE
const Command = require("../../Base/Command");

module.exports = class SelectCommand extends Command {
  constructor(client) {
    super(client, {
      name: "select",
      group: "game",
      memberName: "select",
      description: "Select a character.",
      examples: [`${client.commandPrefix} select [characterName]`],
      args: [
        {
          key: "characterName",
          prompt: `What character do you want to select?`,
          type: "string",
        },
      ],
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
      userPermissions: ["ADMINISTRATOR"],
    });
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

    player.selectedCharacter = characterName;
    this.Game.Database.savePlayer(player)
  }
};
