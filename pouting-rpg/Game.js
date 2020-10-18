// BASE
const BaseDiscord = require("../Base/Discord");
const BaseGame = require("../Base/Game");
const BaseHelper = require("../Base/Helper");
const { aggregation } = require("../Base/Util");

// DATA
const { newQuest } = require("../database/schemas/quest");
const emojis = require("../pouting-rpg/data/emojis");
const enumHelper = require("../utils/enumHelper");

// UTILS
const Database = require("../database/Database");

class Game extends aggregation(BaseGame, BaseHelper) {
  constructor(client) {
    super();
    this.Discord = new BaseDiscord(client);
    this.Database = new Database();
  }

  async findPlayer(user, msg) {
    if (this.Discord.waitingOnResponse.has(user.id)) {
      msg.reply(
        "Please respond to the previous command before executing another."
      );
      return false;
    }
    const res = await this.Database.loadPlayer(user.id);
    if (!res && msg) {
      return msg.say(
        msg.author.id == user.id
          ? `Please type \`${msg.client.commandPrefix}start\` to begin.`
          : `${user.username} hasn't started climbing the Tower.`
      );
    }
    return res;
  }

  /**
   * Returns leaderboard of a certain attribute
   * @param {Object} msg
   * @param {String} type
   */
  leaderboard(msg, type = "level") {
    this.Database.loadLeaderboard(type).then(async (leaderboard) => {
      const embeds = [];
      let { maxPage } = this.Pagination.paginate(
        leaderboard,
        1,
        enumHelper.pageLength
      );

      for (let page = 0; page < maxPage; page++) {
        let { items } = this.Pagination.paginate(
          leaderboard,
          page + 1,
          enumHelper.pageLength
        );
        let description = "";
        for (let i = 0; i < items.length; i++) {
          let attributes = [];
          const player = items[i];
          try {
            const user = await msg.client.users.fetch(player.discordId);
            switch (type) {
              case "level":
                attributes.push(`Level: ${player.level}`);
                break;
            }
            description += `${user.username} | ${attributes.join(" - ")}\n`;
          } catch (err) {
            console.log(err);
          }
        }
        embeds.push(
          new MessageEmbed()
            .setTitle(`[Page ${page + 1}/${maxPage}]`)
            .setDescription(description)
        );
      }
      this.Pagination.buildEmbeds(embeds, msg);
    });
  }

  async activateEvent(guildId, player, onlinePlayers) {
    try {
      const loadedPlayer = await this.Database.loadPlayer(player.discordId);
      if (!loadedPlayer) {
        const newPlayer = await this.Database.createNewPlayer(player.discordId);

        return await this.updatePlayer({
          type: "actions",
          updatedPlayer: newPlayer,
          msg: [
            `${this.generatePlayerName(newPlayer, true)} was born in \`${
              newPlayer.map.name
            }\`! Welcome to the world of Idle-RPG!`,
          ],
          pm: ["You were born."],
        });
      }
      if (loadedPlayer.guildId !== guildId) {
        return;
      }

      // Update players name in case they altered their Discord name
      loadedPlayer.name = player.name;

      if (!loadedPlayer.quest && !loadedPlayer.quest.questMob) {
        loadedPlayer.quest = newQuest;
      }

      const loadedGuildConfig = await this.Database.loadGame(player.guildId);
      await this.passiveRegen(
        loadedPlayer,
        (5 * loadedPlayer.level) / 4 + loadedPlayer.stats.end / 8,
        (5 * loadedPlayer.level) / 4 + loadedPlayer.stats.int / 8
      );
      let eventResults = await this.selectEvent(
        loadedGuildConfig,
        loadedPlayer,
        onlinePlayers
      );
      eventResults = await this.setPlayerTitles(eventResults);
      const msgResults = await this.updatePlayer(eventResults);

      return msgResults;
    } catch (err) {
      errorLog.error(err);
    }
  }

  async setPlayerTitles(eventResults) {
    if (
      roamingNpcs.find(
        (npc) => npc.discordId === eventResults.updatedPlayer.discordId
      )
    ) {
      return eventResults;
    }

    await Object.keys(titles).forEach((title) => {
      eventResults.updatedPlayer = this.manageTitles(eventResults, title);
    });

    return eventResults;
  }
}

module.exports = Game;
