//BASE
const { Command } = require("discord.js-commando");

const { MessageEmbed } = require("discord.js");

//DATA

// UTILS
const { Game } = require("../../DiscordBot");

module.exports = class ChapterCommand extends Command {
  constructor(client) {
    super(client, {
      name: "chapter",
      group: "game",
      memberName: "chapter",
      description: "View your chapter progression.",
      args: [],
      throttling: {
        usages: 1,
        duration: 2,
      },
      guildOnly: true,
    });
  }

  async run(msg) {
    const player = await findPlayer(msg.author, msg);
    player.addQuests = addQuests;
    //player.addQuests();
    console.log(player.quests[3].progress);
    const arc = Arcs[player.arc];
    const chapter = arc.chapters[player.chapter];
    const { totalPercent, questsInfo } = getQuestsInfo(player.quests);
    const messageEmbed = new MessageEmbed()
      .setColor(colors.embed.game)
      .setTitle(`${chapter.emoji} ${chapter.name}`)
      .addFields(
        {
          name: `${Emojis["chapter"]} ${arc.name} - Chapter ${
            player.chapter + 1
          }/${arc.chapters.length}`,
          value: chapter.description,
        },
        {
          name: `${Emojis["quests"]} Quests (${totalPercent}%)`,
          value: questsInfo,
        }
      );
    msg.say(msg.author, messageEmbed);
  }
};

function getQuestsInfo(quests) {
  let content = "";
  let totalPercent = 0;
  for (const quest of quests) {
    content += `- ${quest.type} **${quest.goal}** `;
    switch (quest.type) {
      case "Defeat":
        content += `Enemies`;
        break;
      case "Fish":
        content += `${quest.id} ${fishes[quest.id].emoji}`;
        break;
      case "Collect":
        content += `${quest.id} ${Emojis[quest.id]}`;
        break;
      case "Use":
        content += `${quest.id}`;
        break;
    }
    const percent = Math.floor((quest.progress / quest.goal) * 100);
    totalPercent += percent;
    content += `: ${quest.progress}/${quest.goal} (${percent}%)\n`;
  }
  return {
    questsInfo: content,
    totalPercent: Math.floor(totalPercent / quests.length),
  };
}
