//BASE
const PaginationEmbed = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../../pouting-rpg/data/emojis");

class Pagination {
  constructor(Discord) {
    this.Discord = Discord;
  }

  async buildEmbeds(params, formatFilter, data, pageLength = 10) {
    //prettier-ignore
    const { msg, footer } = params;

    const embeds = [];
    let { maxPage } = this.paginate(data, 1, pageLength);

    for (let page = 0; page < maxPage; page++) {
      let { items } = this.paginate(data, page + 1, pageLength);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        description += `${await formatFilter(items[i], i)}\n`;
      }
      embeds.push(
        new MessageEmbed()
          .setDescription(description)
          .setFooter(`Page ${page + 1}/${maxPage}${footer ? ` | ${footer}` : ""}`)
      );
    }

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
      .setDisabledNavigationEmojis(["delete"]);
    params.Embed = Embeds;
    Embeds = this.Discord.buildEmbed(params)
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
