//BASE
const Command = require("../../Base/Command");
const { stripIndents } = require("common-tags");

//DATA
const arcs = require("../../poutingRPG/data/arcs");

// UTILS
const PVEBattle = require("../../utils/game/PVEBattle");

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
    const player = await this.Game.Database.findPlayer(msg.author, msg);
    if (!player) return;

    //this.Game.Database.addQuests(player);
    console.log(player.storyQuests[3].progress);
    const arc = arcs[player.story.arc];
    const chapter = arc.chapters[player.story.chapter];
    const { totalPercent, questsInfo } = getQuestsInfo(
      this.Discord,
      player.storyQuests
    );

    //prettier-ignore
    let description = stripIndents(`
    ${chapter.emoji} **${chapter.location.toUpperCase()}**

    📖 **__${arc.name} Arc__  - Chapter ${player.story.chapter + 1}/${arc.chapters.length}** : ${chapter.name}
    ${this.setImportantMessage(chapter.description)}
  
    📜 **__Quests__**: (${totalPercent}%)
    ${questsInfo}
    `);
    msg.reply(`\n${description}`);
  }
};

function getQuestsInfo(Discord, storyQuests) {
  let content = "";
  let totalPercent = 0;
  for (const quest of storyQuests) {
    content += `- ${quest.type} **${quest.goal}** `;
    switch (quest.type) {
      case "Defeat":
        content += `${quest.questId}`;
        break;
      case "Earn":
        content += `${quest.questId}${Discord.emoji(quest.questId)}`;
        break;
      case "Collect":
        content += `${quest.questId} ${Discord.emoji(quest.questId)} `;
        break;
      case "Use":
        content += `${quest.questId}`;
        break;
    }
    const percent = Math.floor((quest.progress / quest.goal) * 100);
    totalPercent += percent;
    content += `: ${quest.progress}/${quest.goal} (${percent}%)\n`;
  }
  return {
    questsInfo: content,
    totalPercent: Math.floor(totalPercent / storyQuests.length),
  };
}
