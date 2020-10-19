//BASE
const PaginationEmbed = require("Discord-paginationembed");
const { MessageEmbed } = require("Discord.js");

//DATA
const emojis = require("../../pouting-rpg/data/emojis");

class Pagination {
  async buildEmbeds(params) {
    const { color, title, author, embeds, msg } = params;
    /*
    const embeds = [];
    let { maxPage } = this.paginate(totalItems, 1, pageLength);

    for (let page = 0; page < maxPage; page++) {
      let { items } = this.paginate(totalItems, page + 1, pageLength);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        description += `\n`;
      }
      embeds.push(
        new MessageEmbed()
          .setTitle(`[Page ${page + 1}/${maxPage}]`)
          .setDescription(description)
      );
    }
    */
    const Embeds = new PaginationEmbed.Embeds()
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
      .setDisabledNavigationEmojis(["delete"]);
    if (color) Embeds.setColor(color);
    if (title)
      Embeds.setTitle(`${author ? `${author.username}'s ` : ""}${title}`);
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
