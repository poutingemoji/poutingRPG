require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer, createNewPlayer } = require("../../database/Database");

const { colors } = require("../../utils/helpers/enumHelper");
const { emoji, confirmation } = require("../../utils/helpers/msgHelper");
const { titleCase } = require("../../utils/helpers/strHelper");

const Families = require("../../docs/data/Families");
const Positions = require("../../docs/data/Positions");
const Races = require("../../docs/data/Races");

const traits = [Positions];

module.exports = class StartCommand extends Command {
  constructor(client) {
    super(client, {
      name: "start",
      aliases: [],
      group: "game",
      memberName: "start",
      description: "Begin your adventure up the Tower.",
      examples: [`${client.commandPrefix}start`],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 60,
      },
    });
  }

  async run(msg) {
    const player = await findPlayer(msg.author);
    if (player) {
      const res = await confirmation(
        msg,
        `${msg.author}, do you want to start over?`
      );
      if (!res) return;
    }

    const messageEmbed = new MessageEmbed().setColor(colors.embed.game);

    const choose = [
      function () {
        var description = "";
        var i = 0;
        for (var value of Object.values(Positions)) {
          if (!(value.category == "basic")) break;
          i++;
          description += `${i} - **${value.name}** ${value.emoji}\n`;
        }
        return {
          title: "Choose your position:",
          description: description,
        };
      },
    ];
    
    const traitsChosen = [];
    for (var i = 0; i < traits.length; i++) {
      console.log(choose[i]);
      const { title, description, footer } = choose[i]();
      messageEmbed.setTitle(title);
      messageEmbed.setDescription(description);
      if (footer) messageEmbed.setFooter(footer);

      const filter = (res) => {
        return (
          Object.keys(Object.keys(traits[i]))
            .map((n) => `${parseInt(n) + 1}`)
            .includes(res.content) && res.author.id === msg.author.id
        );
      };

      traitsChosen.push(
        await msg.say(messageEmbed).then((msgSent) => {
          return msgSent.channel
            .awaitMessages(filter, { max: 1, time: 60000 })
            .then((res) => {
              msgSent.delete();
              return Object.keys(traits[i])[res.first().content - 1];
            })
            .catch((err) => {
              return;
            });
        })
      );
      if (!traitsChosen[i]) return;
    }

    msg.say(
      new MessageEmbed()
        .setColor(colors.embed.game)
        .setDescription(`I sincerely welcome you to the Tower.`)
    );
    createNewPlayer(msg.author, traitsChosen);
  }
};