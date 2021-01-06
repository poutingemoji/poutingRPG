//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../data/arcs");

//Utils
const { setImportantMessage } = require("../../utils/Helper");

module.exports = class ChapterCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "chapter",
      group: "user_info",
      memberName: "chapter",
      description: "View your chapter progression.",
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run(msg) {
    const player = await this.Game.findPlayer(msg.author, msg);
    if (!player) return;

    this.Game.addQuests(player);
    console.log(player.quests.story[3].progress);
    const arc = arcs[player.progression.story.arc];
    const chapter = arc.chapters[player.progression.story.chapter];
    const { totalPercent, questsInfo } = getQuestsInfo(
      this.Discord,
      player.quests
    );

    //prettier-ignore
    let description = stripIndents(`
    📖 **__${arc.name} Arc__  - Chapter ${player.progression.story.chapter + 1}/${arc.chapters.length}** : ${chapter.name}
    ${setImportantMessage(chapter.description)}
  
    📜 **__Quests__**: (${totalPercent}%)
    ${questsInfo}
    `);
    msg.reply(`\n${description}`);
  }
};

function getQuestsInfo(Discord, quests) {
  let content = "";
  let totalPercent = 0;
  for (const quest of quests.story) {
    content += `- ${quest.type} **${quest.goal}** `;
    switch (quest.type) {
      case "defeat":
        content += `${quest.questId}`;
        break;
      case "earn":
        content += `${quest.questId}${Discord.emoji(quest.questId)}`;
        break;
      case "collect":
        content += `${quest.questId} ${Discord.emoji(quest.questId)} `;
        break;
      case "use":
        content += `${quest.questId}`;
        break;
    }
    const percent = Math.floor((quest.progress / quest.goal) * 100);
    totalPercent += percent;
    content += `: ${quest.progress}/${quest.goal} (${percent}%)\n`;
  }
  return {
    questsInfo: content,
    totalPercent: Math.floor(totalPercent / quests.story.length),
  };
}
