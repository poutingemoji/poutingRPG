require("dotenv").config();
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { findPlayer } = require("../../database/Database");
const {
  clamp,
  titleCase,
  secondsToDhms,
  numberWithCommas,
  paginate,
} = require("../../utils/Helper");
const { commandInfo, buildEmbeds } = require("../../utils/msgHelper");
const {
  moods,
  moodColors,
  petNeeds,
  petActions,
  links,
} = require("../../utils/enumHelper");

const {
  buyPet,
  updateNeedsPet,
  addExpPet,
  renamePet,
  removePet,
} = require("../../database/functions");

const pets = require("../../docs/data/pets.js");

const pageLength = 4;
const oneOf = [
  "",
  "feed",
  "wash",
  "play",
  "pat",
  "name",
  "disown",
  "list",
  "buy",
];

module.exports = class petCommand extends Command {
  constructor(client) {
    super(client, {
      name: "pet",
      aliases: [],
      group: "game",
      memberName: "pet",
      description: "Displays your pet.",
      examples: [
        `${client.commandPrefix}pet`,
        `${client.commandPrefix}pet feed`,
        `${client.commandPrefix}pet wash`,
        `${client.commandPrefix}pet play`,
        `${client.commandPrefix}pet pat`,
        `${client.commandPrefix}pet name`,
        `${client.commandPrefix}pet disown`,
        `${client.commandPrefix}pet list`,
        `${client.commandPrefix}pet buy`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [
        {
          key: "action",
          prompt: "What would you like to do to your pet?",
          type: "string",
          default: "",
        },
        {
          key: "nickname",
          prompt: "What would you like to call your pet?",
          type: "string",
          default: false,
        },
      ],
      throttling: {
        usages: 1,
        duration: 4,
      },
    });
  }

  //console.log(newQuest('Collect', [15, 'Blueberries'], {points: 10, exp: 200}))
  async run(msg, { action, nickname }) {
    if (!oneOf.includes(action) && !pets.hasOwnProperty(action)) {
      return commandInfo(msg, this);
    }
    const player = await findPlayer(msg.author, msg);
    player.buyPet = buyPet;
    player.updateNeedsPet = updateNeedsPet;
    player.addExpPet = addExpPet;
    player.renamePet = renamePet;
    player.removePet = removePet;
    var pet = player.pet;

    if (pets.hasOwnProperty(action)) {
      var id = action;
      if (!pets[id]) return msg.say(`There is no pet with the id, ${id}.`);
      if (player.pet.id)
        return msg.say(
          "You need to disown your current pet before buying another."
        );
      if (pets[id].price > player.points)
        return msg.say(
          `You dont't have enough money to purchase ${pets[id].emoji} ${pets[id].name}.`
        );
      await player.buyPet(id);
      return msg.say(
        `You bought a ${pets[id].emoji} **${pets[id].name}**. Congratulations!`
      );
    }

    switch (action) {
      case "list":
        const embeds = [];
        var { maxPage } = paginate(Object.keys(pets), 1, pageLength);
        for (let page = 0; page < maxPage; page++) {
          var { items } = paginate(Object.keys(pets), page + 1, pageLength);
          let itemsOffered = "";
          for (let item = 0; item < items.length; item++) {
            const itemInfo = pets[items[item]];
            itemsOffered += `${itemInfo.emoji} **${itemInfo.name}**\n*[id: ${
              items[item]
            }](${links.website})*\n${numberWithCommas(
              itemInfo.price
            )} points\n\n`;
          }
          embeds.push(
            new MessageEmbed()
              .setTitle(`[Page ${page + 1}/${maxPage}]`)
              .setDescription(itemsOffered)
          );
        }
        buildEmbeds(
          msg,
          embeds,
          `To purchase a pet: ${this.client.commandPrefix}pet [id]`
        );
        break;
      case "name":
        if (nickname.length > 32 || !nickname)
          return msg.say(
            "Please keep your nickname at 32 characters or under."
          );
        player.renamePet(nickname);
        msg.say(`Your pet's name is now **${nickname}**.`);
        break;
      case "disown":
        msg.say(
          `You have disowned ${
            pet.nickname
              ? pet.nickname
              : `your ${pets[pet.id].name} ${pets[pet.id].emoji}`
          }.`
        );
        console.log(player.pet.id);
        player.removePet();
        break;
      default:
        if (!pets[pet.id])
          return msg.say(
            `You don't have a pet. You can view a list of the pets with: \`${this.client.commandPrefix}pet list\``
          );

        var differences = [];
        if (Object.keys(petActions).includes(action)) {
          const actionIndex = Object.keys(petActions).findIndex(
            (a) => action == a
          );
          const needIncrease =
            clamp(pet[petNeeds[actionIndex]] + 42, 0, 100) -
            pet[petNeeds[actionIndex]];
          if (needIncrease == 0)
            return msg.say(
              `Your ${petNeeds[actionIndex]} is maxed. Please wait for it to go down.`
            );
          differences[actionIndex] = 42;
          player.updateNeedsPet(differences);
          player.addExpPet(Math.round(needIncrease / 4), 0, 100);
          return msg.say(`You ${action} your pet.`);
        }

        const secondsPassed = (Date.now() - pet.updatedAt) / 1000;
        for (var i = 0; i < petNeeds.length; i++) {
          const difference =
            -(secondsPassed / pets[pet.id].empty[petNeeds[i]]) * 100;
          differences.push(difference);
          pet[petNeeds[i]] += difference;
        }
        player.updateNeedsPet(differences);
        const messageEmbed = new MessageEmbed()
          .setTitle(
            `${msg.member.nickname || msg.author.username}'s ${
              pets[pet.id].name
            } ${pets[pet.id].emoji}\n${
              pet.nickname !== "" ? `(${pet.nickname})` : ""
            }`
          )
          .setThumbnail(pets[pet.id].image);

        var roundedNeeds = [];
        for (var i = 0; i < petNeeds.length; i++) {
          var need = petNeeds[i];
          pet[need] = clamp(pet[need], 0, 100);
          var roundedNeed = Math.round(pet[need]);
          roundedNeeds.push(roundedNeed);
          messageEmbed.addField(
            `${titleCase(need)} (${roundedNeed}%)`,
            `[${progressBar(
              roundedNeed / 100
            )}](https://www.youtube.com/user/pokimane)\n${
              pet[need] !== 0
                ? `\`${secondsToDhms(
                    (pet[need] / 100) * pets[pet.id].empty[need],
                    " and ",
                    true,
                    2
                  )} Left\``
                : "Empty"
            }`,
            true
          );
        }
        const mood = calculateMood(roundedNeeds);
        messageEmbed.setColor(moodColors[mood]);
        messageEmbed.addFields(
          {
            name: `Experience`,
            value: `[${progressBar(
              pet.exp / pet.expMax
            )}](https://www.youtube.com/user/pokimane)\n\`Level ${pet.level} (${
              pet.exp
            }/${pet.expMax})\``,
            inline: true,
          },
          { name: `Mood`, value: mood, inline: true }
        );
        msg.say(messageEmbed);
    }
  }
};

function progressBar(value) {
  value = Math.round(clamp(value, 0, 1) * 10);
  return `${"■".repeat(value)}${"□".repeat(10 - value)}`;
}

function calculateMood(needs) {
  if (needs.every((n) => 80 <= n)) {
    return "Great";
  } else if (needs.every((n) => 80 > n > 46)) {
    return "Fine";
  } else {
    var moodIndex = needs.indexOf(Math.min(...needs))
    var mood = needs[moodIndex]
    if (46 > mood) {
      return moods[moodIndex].low
    } else {
      moodIndex = needs.indexOf(Math.max(...needs))
      mood = needs[moodIndex]
      return moods[moodIndex].high
    }
  }
}
