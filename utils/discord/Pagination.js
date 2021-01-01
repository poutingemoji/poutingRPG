//BASE
const PaginationEmbed = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../../data/emojis");
const enemies = require("../../data/enemies");

const enumHelper = require("../enumHelper");
class Pagination {
  constructor(Discord) {
    this.Discord = Discord;
  }

  async buildEmbeds(params, formatFilter, data) {
    const {
      msg,
      author,
      title,
      pageLength,
      startingIndex,
      globalNumbering,
    } = params;
    if (!(typeof data === "object")) return;
    if (data instanceof Map) data = Array.from(data.keys());
    if (data instanceof Array) data = { "": data };
    const firstKey = Object.keys(data)[0]
    if (data[firstKey].length == 0) return msg.reply(`Your \`${title} | ${firstKey.length == 0 ?  "" : firstKey}\` is empty. 😔`);

    const categories = Object.keys(data);
    const embeds = [];
    let startingPage = 1;
    let globalIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const categoryData = data[categories[i]];
      const { maxPage } = this.paginate(categoryData, 1, pageLength);
      for (let page = 0; page < maxPage; page++) {
        const { items } = this.paginate(categoryData, page + 1, pageLength);
        let description = "";
        console.log("ITEMS", items)
        for (let i = 0; i < items.length; i++) {
          if (globalIndex == startingIndex) startingPage = page + 1;
          description += `${await formatFilter(
            items[i],
            globalNumbering ? globalIndex : i
          )}\n`;
          globalIndex++;
        }
        embeds.push(
          new MessageEmbed()
            .setTitle(
              `${author ? `${author.username}'s ` : ""}${title}${
                categories[i] !== "" ? ` | ${categories[i]}` : ""
              }`
            )
            .setDescription(description)
            .setFooter(`Page ${page} of ${maxPage}`)
        );
      }
    }
    delete params.title;
    console.log("STARTING PAGE", startingPage);
    let Embeds = new PaginationEmbed.Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setPage(startingPage)
      .setClientAssets({
        msg,
        prompt: "{{user}}, Which page would you like to see?",
      })
      .setNavigationEmojis({
        back: "⬅️",
        delete: emojis.red_cross,
        forward: "➡️",
        jump: "🔢",
      })
      .setDisabledNavigationEmojis(["delete"])
      .setPageIndicator("footer");
    params.embed = Embeds;
    Embeds = this.Discord.buildEmbed(params);
    await Embeds.build();
  }

  paginate(items, page = 1, pageLength = enumHelper.pageLength) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;
    return {
      items:
        items.length > pageLength
          ? items.slice(startIndex, startIndex + pageLength)
          : items,
      page,
      maxPage,
      pageLength,
    };
  }
}

module.exports = Pagination;
