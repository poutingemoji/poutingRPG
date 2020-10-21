//BASE
const PaginationEmbed = require("discord-paginationembed");
const { MessageEmbed } = require("discord.js");

//DATA
const emojis = require("../../pouting-rpg/data/emojis");

// UTILS

class Pagination {
  constructor(Discord) {
    this.Discord = Discord;
  }

  async buildEmbeds(params, format, totalItems, pageLength = 10) {
    //prettier-ignore
    const { msg, color, thumbnail, title, author, description, image, footer } = params;

    const embeds = [];
    let { maxPage } = this.paginate(totalItems, 1, pageLength);

    for (let page = 0; page < maxPage; page++) {
      let { items } = this.paginate(totalItems, page + 1, pageLength);
      let description = "";
      for (let i = 0; i < items.length; i++) {
        description += `${await format(i)}\n`;
      }
      embeds.push(
        new MessageEmbed()
          .setDescription(description)
          .setFooter(`Page ${page + 1}/${maxPage}`)
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
