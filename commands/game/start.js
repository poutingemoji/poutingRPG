require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer, createNewPlayer } = require("../../database/Database");
const { changeValue } = require("../../database/functions");

const { colors } = require("../../utils/helpers/enumHelper");
const { confirmation, Messages } = require("../../utils/helpers/msgHelper");
const { titleCase } = require("../../utils/helpers/strHelper");

const { positions } = require("../../docs/data/Emojis");
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
      description: "Start your adventure.",
      examples: [],
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
    const player = await findPlayer(msg.author, msg, false);
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
          console.log(value);
          description += `${i} - **${value.name}** ${
            positions[value.name.toLowerCase().replace(/ /g, "_")]
          }\n`;
        }
        return {
          title: "Choose your position:",
          description: description,
        };
      },
    ];

    const traitsChosen = [];
    for (var i = 0; i < traits.length; i++) {
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
      const res = await Messages(msg, filter, messageEmbed);
      console.log(res)
      if (res.size == 0) return;
      traitsChosen.push(Object.keys(traits[i])[res.first().content - 1]);
      console.log(traitsChosen[i])
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
