//BASE
const PaginationEmbed = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../../data/emojis");

class Pagination {
  constructor(Discord) {
    this.Discord = Discord;
  }

  async buildEmbeds(params, formatFilter, data, pageLength = 10) {
    if (!(typeof data === "object")) return;
    if (data instanceof Map) data = Array.from(data.keys());
    if (data instanceof Array) data = { "": data };

    const categories = Object.keys(data);
    console.log(categories);
    let { msg, author, title } = params;
    const embeds = [];
    for (let i = 0; i < categories.length; i++) {
      const categoryData = data[categories[i]];
      const { maxPage } = this.paginate(categoryData, 1, pageLength);
      if (maxPage == 0) return msg.say(`Your ${title} has nothing inside.`);

      for (let page = 0; page < maxPage; page++) {
        const { items } = this.paginate(categoryData, page + 1, pageLength);
        let description = "";
        for (let i = 0; i < items.length; i++) {
          description += `${await formatFilter(items[i], i)}\n`;
        }
        embeds.push(
          new MessageEmbed()
            //prettier-ignore
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
    let Embeds = new PaginationEmbed.Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
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

  paginate(items, page = 1, pageLength = 10) {
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
