//BASE
const Command = require("../../Base/Command");

//DATA

//UTILS

module.exports = class UpdateAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: "updateall",
      group: "game",
      memberName: "updateall",
      description: "Update all MongoDB documents.",
      throttling: {
        usages: 1,
        duration: 2000000000,
      },
      guildOnly: true,
      hidden: true,
      ownerOnly: true,
    });
  }

  run(msg) {
    updateAllPlayers();
    return msg.say("Updated all MongoDB documents, master.");
  }
};
