//BASE
const BaseDiscord = require("./Base/Discord");
const { CommandoClient } = require("discord.js-commando");
const DBL = require("dblapi.js");
const path = require("path");
const fs = require("fs");
const BaseHelper = require("./base/Helper");

//DATA
const Game = require("./pouting-rpg/Game");
const characters = require("./pouting-rpg/data/characters");

//UTILS
const enumHelper = require("./utils/enumHelper");

require("dotenv").config();

class DiscordBot extends BaseHelper {
  constructor() {
    super();
    this.client = new CommandoClient({
      commandPrefix: process.env.PREFIX,
      owner: "257641125135908866",
      invite: enumHelper.links.supportServer,
      disableEveryone: true,
      shards: "auto",
    });
    this.Game = new Game(this.client);
    this.Discord = new BaseDiscord(this.client);
    this.loadEventListeners();
    this.postStatisticsOnDBL();
    this.client.login(process.env.TOKEN);
  }

  loadEventListeners() {
    this.client.dispatcher.addInhibitor((msg) => {
      if (enumHelper.waitingOnResponse.has(msg.author.id)) {
        return {
          reason: "Already has message listening.",
          response: msg.reply(
            "Please respond to the previous command before executing another."
          ),
        };
      }
    });

    this.client.on("error", console.error);
    this.client.once("ready", () => {
      console.log(
        `Logged in as ${this.client.user.tag}! (${this.client.user.id})`
      );
      console.log("Guilds: " + this.client.guilds.cache.size);
      console.log("Users: " + this.client.users.cache.size);

      if (!this.client.user.avatarURL) {
        // avatarURL == null if not set
        this.client.user.setAvatar(
          fs.readFileSync("./images/poutingbot_Square.png")
        );
      }
      this.client.user.setActivity(`${this.client.commandPrefix}help`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/pokimane",
      });
    });
    /*
    this.client.on("guildCreate", (guild) => {
      guild.owner
        .send(`Thanks for inviting me into this server!`)
        .catch((err) => {
          let channel = guild.channels.cache
            .filter((c) => c.type === "text")
            .find((x) => x.position === 0);
          channel.send("yes").catch((err) => {
            console.log(err);
          });
        });
    });*/

    this.client.on("message", async (msg) => {
      if (msg.author.bot || !msg.guild) return;
      if (!(await this.Game.Database.isSpawnsEnabled(msg.channel))) return;
      if (enumHelper.talkedRecently.has(msg.author.id)) return;
      if (Math.random() < 0.5) return;

      enumHelper.talkedRecently.add(msg.author.id);

      const characterFilter = (characterName) => {
        return !enumHelper.isMC(characterName);
      };
      const characterName = this.Game.roguelike(characters, 1, characterFilter);

      const msgFilter = (msg) => {
        return msg.content.toLowerCase() == characterName.toLowerCase();
      };

      let messageEmbed = this.Discord.buildEmbed({
        title: "A regular has appeared!",
        description:
          "Guess their name and type it in\nthe chat to recruit them.",
        filePath: `./images/characters/${characterName.replace(" ", "_")}.png`,
      });

      setTimeout(() => {
        msg.channel.send(messageEmbed).then((msgSent) => {
          msg.channel
            .awaitMessages(msgFilter, { max: 1, time: 60000, errors: ["time"] })
            .then(async (collected) => {
              msg.say(
                `After some convincing from ${
                  collected.first().author
                },\n**${characterName}** decided to join them on their adventure.`
              );
              msgSent.delete();
              collected.first().delete();
              const player = await this.Game.Database.findPlayer(msg.author);
              this.Game.Database.addCharacter(player, characterName);
            })
            .catch((err) => {
              console.log(err);
              msgSent.delete();
            });
        });
        console.log("deleted");
        setTimeout(() => {
          enumHelper.talkedRecently.delete(msg.author.id);
        }, 10000);
      }, 5 * 60000);
    });
  }

  postStatisticsOnDBL() {
    if (!process.env.PRODUCTION) return;
    const dbl = new DBL(process.env.DBL_KEY, this.client);
    dbl.on("posted", () => {
      console.log("Server count posted!");
    });

    dbl.on("error", (err) => {
      console.error(err);
    });
  }

  loadCommands() {
    this.client.registry
      .registerDefaultTypes()
      .registerGroups([
        ["game", "Game Commands"],
        ["info", "Info Commands"],
        ["storage", "Storage Commands"],
      ])
      .registerDefaultGroups()
      .registerDefaultCommands({
        unknownCommand: false,
        help: false,
      })
      .registerCommandsIn(path.join(__dirname, "commands"));

    /*
      Updates Commands on website
    */
    const groups = this.client.registry.groups;
    let commands = [];
    const jsonFiles = {
      ["Game Commands"]: "game",
      ["Info Commands"]: "info",
      ["Storage Commands"]: "storage",
    };
    let commandsInfo = {};
    const secondsToTimeFormat = this.secondsToTimeFormat;
    Object.keys(jsonFiles).forEach(function (key) {
      groups
        .filter(
          (grp) => grp.name === key && grp.commands.some((cmd) => !cmd.hidden)
        )
        .map((grp) => {
          grp.commands
            .filter((cmd) => !cmd.hidden)
            .map((cmd) =>
              commands.push([
                `${cmd.name}`,
                `${cmd.description}${cmd.nsfw ? " (NSFW)" : ""}`,
                `${cmd.examples ? cmd.examples.join("\n") : ""}`,
                `${cmd.aliases ? cmd.aliases.join("\n") : ""}`,
                secondsToTimeFormat(cmd.throttling.duration, ", ", false),
              ])
            );
        });
      commandsInfo[jsonFiles[key]] = commands;
      commands = [];
    });

    fs.writeFile(
      `./docs/commandinfo.json`,
      JSON.stringify(commandsInfo),
      function () {
        console.log("commandinfo.json Refreshed.");
      }
    );
  }
}

module.exports = new DiscordBot();
