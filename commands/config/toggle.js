//BASE
const Command = require("../../Base/Command");

module.exports = class ToggleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "toggle",
      group: "config",
      memberName: "toggle",
      description: "Toggle a setting.",
      args: [
        {
          key: "setting",
          prompt: `What setting do you want to configure?`,
          type: "string",
          oneOf: ["spawns"],
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

  async run(msg, { setting }) {
    const channel = msg.channel;
    let response;
    switch (setting) {
      case "spawns":
        response = await this.Game.Database.setSpawnsEnabled(channel);
        break;
    }
    msg.say(response);
  }
};
