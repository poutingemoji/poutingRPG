const { MessageEmbed } = require("discord.js");

const { titleCase } = require("../helpers/strHelper");
const { secondsToDhms } = require("../helpers/intHelper");
const { colors } = require("./enumHelper");

const Emojis = require("../../docs/data/Emojis.js");

const Pagination = require("discord-paginationembed");

const msgHelper = {
  emoji(msg, emoji) {
    
    return msg.client.emojis.cache.get(Emojis[emoji]).toString();
  },
  chooseOne(msg, array, content, embed) {
    return msg.reply(content, embed).then(async (msgSent) => {
      for (var i = 0; i < array.length; i++) {
        await msgSent.react(array[i]);
      }

      const filter = (reaction, user) => {
        return array.includes(reaction.emoji.name) && user.id === msg.author.id;
      };

      return msgSent
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          msgSent.delete();
          return array.indexOf(collected.first().emoji.name);
        })
        .catch(() => {
          msgSent.delete();
          return false;
        });
    });
  },
  confirmation(msg, content) {
    return msg.say(content).then((msgSent) => {
      msgSent.react(Emojis["check"]).then(() => msgSent.react(Emojis["cross"]));

      const filter = (reaction, user) => {
        return (
          ["check", "cross"].includes(reaction.emoji.name) &&
          user.id === msg.author.id
        );
      };

      return msgSent
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          msgSent.delete();
          if (collected.first().emoji.name == "check") return true;
          else return false;
        })
        .catch(() => msgSent.delete());
    });
  },
  commandInfo(msg, command) {
    const messageEmbed = new MessageEmbed()
      .setColor(colors.embed.bot)
      .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL())
      .setTitle(`${titleCase(command.groupID)} Command: ${command.name}`)
      .setURL("https://poutingemoji.github.io/poutingbot/commands.html")
      .setDescription(`**Description**: ${command.description}`)
      .setFooter(
        [
          command.guildOnly ? "Usable only in servers" : false,
          command.nsfw ? "NSFW" : false,
        ]
          .filter(Boolean)
          .join(", ")
      );
    if (command.examples.length > 0)
      messageEmbed.addField("Usage:", command.examples.join("\n"));
    if (command.aliases.length > 0)
      messageEmbed.addField("Aliases:", command.aliases.join(", "));
    messageEmbed.addField(
      "Cooldown:",
      secondsToDhms(command.throttling.duration, ", ")
    );
    msg.say(messageEmbed);
  },
  async buildEmbeds(msg, embeds, footer) {
    const Embeds = new Pagination.Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([msg.author.id])
      .setChannel(msg.channel)
      .setClientAssets({
        msg,
        prompt: "{{user}}, which page would you like to see?",
      })
      .setNavigationEmojis({
        back: "⬅️",
        delete: Emojis.cross,
        forward: "➡️",
        jump: "🔢",
      })
      .setDisabledNavigationEmojis(["delete"])
      .setColor(colors.embed.game);
    if (footer) Embeds.setFooter(footer);
    await Embeds.build();
  },
};

module.exports = msgHelper;
