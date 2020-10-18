//BASE
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const DBL = require("dblapi.js");
const path = require("path");
const fs = require("fs");
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

//DATA
const characters = require("./pouting-rpg/data/characters");
const Game = require("./pouting-rpg/Game");
const enumHelper = require("./utils/enumHelper");

require("dotenv").config();

class DiscordBot {
  constructor() {
    this.client = new CommandoClient({
      commandPrefix: process.env.PREFIX,
      owner: "257641125135908866",
      invite: enumHelper.links.supportServer,
      disableEveryone: true,
      shards: "auto",
    });
    this.setProvider();
    this.Game = new Game(this.client);
    this.Discord = this.Game.Discord;
    this.loadEventListeners();
    this.postStatisticsOnDBL();
    this.client.login(process.env.TOKEN);
    this.talkedRecently = new Set();
  }

  setProvider() {
    open({
      filename: "./sqlite3.db",
      driver: sqlite3.Database
    }).then((db) => {
    this.client.setProvider(new SQLiteProvider(db)).catch(console.error);;
    }).catch(console.error);
  }

  loadEventListeners() {
    this.client.on("error", (err) => errorLog.error(err));
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
      if (msg.author.bot) return;
      if (this.talkedRecently.has(msg.author.id)) return;
      if (Math.random() < 0.5) return;
      console.log(this.talkedRecently);
      this.talkedRecently.add(msg.author.id);
      const character = randomKey(characters);
      const filter = (msg) => {
        return msg.content.toLowerCase() == character.toLowerCase();
      };

      var messageEmbed = this.Discord.buildEmbed({
        title: "A regular has appeared!",
        description:
          "Guess their name and type it in\nthe chat to recruit them.",
        filePath: `./images/characters/${character.replace(" ", "_")}.png`,
      });

      setTimeout(() => {
        this.talkedRecently.delete(msg.author.id);
        msg.channel.send(messageEmbed).then((msgSent) => {
          msg.channel
            .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
            .then((collected) => {
              messageEmbed.setTitle("Successfully recruited!");
              messageEmbed.setDescription(
                `After some convincing from ${
                  collected.first().author
                },\n**${character}** reluctantly joined their team.`
              );
              msgSent.edit(messageEmbed);
              collected.first().delete();
            })
            .catch((err) => {
              msgSent.delete();
            });
        });
      }, 10000);
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
        ["moderation", "Moderation Commands"],
        ["game", "Tower of God Commands"],
        ["info", "Info Commands"],
        ["fun", "Fun Commands"],
        ["social", "Social Commands"],
        ["utility", "Utility Commands"],
      ])
      .registerDefaultGroups()
      .registerDefaultCommands({
        unknownCommand: false,
        help: false,
      })
      .registerCommandsIn(path.join(__dirname, "commands"));

    //Updates Commands on website
    const groups = this.client.registry.groups;
    let commands = [];
    const jsonFiles = {
      ["Moderation Commands"]: "moderation",
      ["Tower of God Commands"]: "game",
      ["Info Commands"]: "info",
      ["Social Commands"]: "social",
      ["Utility Commands"]: "utility",
    };
    let commandsInfo = {};
    const secondsToTimeFormat = this.Game.secondsToTimeFormat;
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
                cmd.examples.join("\n"),
                cmd.aliases.join("\n"),
                secondsToTimeFormat(cmd.throttling.duration),
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

var randomKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
};
