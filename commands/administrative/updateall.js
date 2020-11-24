//BASE
const Command = require("../../Base/Command");

module.exports = class UpdateAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: "updateall",
      group: "administrative",
      memberName: "updateall",
      description: "Update all MongoDB documents.",
      throttling: {
        usages: 1,
        duration: 2000000000,
      },
      hidden: true,
      ownerOnly: true,
    });
  }

  run(msg) {
    this.Game.Database.updateAllPlayers();
    return msg.say("Updated all MongoDB documents, master.");
  }
};
