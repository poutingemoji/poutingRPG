//BASE
const BaseDiscord = require("./Base/Discord");
const BaseGame = require("./Base/Game");

const { stripIndents } = require("common-tags");
const DBL = require("dblapi.js");
const { CommandoClient } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");

//UTILS
const {
  commandGroups,
  links,
  waitingOnResponse,
} = require("./utils/enumHelper");
const { secondsToTimeFormat } = require("./utils/Helper");
require("dotenv").config();

class DiscordBot {
  constructor() {
    this.client = new CommandoClient({
      commandPrefix: process.env.PREFIX,
      owner: "257641125135908866",
      invite: links.supportServer,
      disableEveryone: true,
      shards: "auto",
    });
    this.Discord = new BaseDiscord(this.client);
    this.Game = new BaseGame(this.client);
    this.loadEventListeners();
    this.postStatisticsOnDBL();
    this.client.login(process.env.TOKEN);
  }

  loadEventListeners() {
    this.client.dispatcher.addInhibitor((msg) => {
      if (waitingOnResponse.has(msg.author.id)) {
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
        stripIndents(`
        Logged in as ${this.client.user.tag}! (${this.client.user.id})
        Guilds: ${this.client.guilds.cache.size}
        Users: ${this.client.users.cache.size}
      `)
      );
      if (!this.client.user.avatarURL) {
        // avatarURL == null if not set
        this.client.user.setAvatar(fs.readFileSync("./images/poutingbot.png"));
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
    });
    
    this.client.on("message", (msg) => {
      if (msg.author.id == "") {
        msg.reply("you are dumb")
      }
    });
    */
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
      .registerGroups(Object.entries(commandGroups))
      .registerDefaultGroups()
      .registerDefaultCommands({
        unknownCommand: false,
        help: false,
      })
      .registerCommandsIn(path.join(__dirname, "commands"));

    /*
      Updates Commands on website
    */

    const commandInfos = {};

    this.client.registry.groups
      .filter((grp) => grp.commands.some((cmd) => !cmd.hidden))
      .map((grp) => {
        const groupCommandInfos = [];
        grp.commands
          .filter((cmd) => !cmd.hidden)
          .map((cmd) => {
            groupCommandInfos.push([
              `${cmd.name}`,
              `${cmd.description ? cmd.description : ""}${
                cmd.nsfw ? " (NSFW)" : ""
              }`,
              `${cmd.examples ? cmd.examples.join("\n") : ""}`,
              `${cmd.aliases ? cmd.aliases.join("\n") : ""}`,
              secondsToTimeFormat(
                cmd.throttling ? cmd.throttling.duration : 0,
                ", ",
                false
              ),
            ]);
          });
        commandInfos[grp.name] = groupCommandInfos;
      });

    fs.writeFile(
      `./docs/commandInfos.json`,
      JSON.stringify(commandInfos),
      function () {
        console.log("commandInfos.json Refreshed.");
      }
    );
  }
}

module.exports = new DiscordBot();
