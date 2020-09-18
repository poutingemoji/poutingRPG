require('dotenv').config()
const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

const { findPlayer } = require('../../database/Database');
const { maxShinsu, moveAccuracy, moveDamage } = require('../../utils/enumHelper');

const enemies = require('../../docs/data/enemies.js');
const moves = require('../../docs/data/moves');

module.exports = class BattleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'battle',
      aliases: [],
      group: 'game',
      memberName: 'battle',
      description: 'Start a battle.',
      examples: [
        `${client.commandPrefix}battle`,
      ],
      clientPermissions: [],
      userPermissions: [],
      guildOnly: true,
      args: [],
      throttling: {
        usages: 1,
        duration: 5
      },
    })
  }

  async run(msg) {
    const player = await findPlayer(msg, msg.author)
    var quest
    for (var i = 0; i < player.quests.length; i++) {
      if (player.quests[i].objectiveType == 'Defeat') {
        quest = player.quests[i]
      }
    } 
    if (!quest) return

    const enemy = enemies[quest.objective.name]

    var players = {
      [true] : {
        name: msg.author.username,
        health: player.health,
        damage: moveDamage(player.move.id),
        speed: 100,
      },
      [false] : {
        name: enemy.name,
        health: enemy.health,
        damage: enemy.damage,
        speed: enemy.speed,
      },
    }
 
    var i = 0
    const messageEmbed = new MessageEmbed()
    var battleHistory = ''


    //critical strike, damage when blocking
    while (i < 10) {
      i++
      var player1 = players[true].speed >= players[false].speed
      var player2 = !player1
      battleHistory += `Turn ${i}:\n`
      battleHistory += `${players[player1].name} attacks `
      if (Math.random() >= .5) {
        console.log(players[player1].damage)
        battleHistory += `${players[player2].name}, he loses ${players[player1].damage} HP(s).\n`
      } else if (Math.random() >= .5) {
        battleHistory += `but ${players[player2].name} blocks it, he loses ${players[player1].damage} HP(s).\n`
      } else {
        battleHistory += `but ${players[player2].name} dodges!\n`
      }

      battleHistory += `${players[player2].name} attacks `
      if (Math.random() >= .5) {
        console.log(players[player2].damage)
        battleHistory += `${players[player1].name}, he loses ${players[player2].damage} HP(s).\n`
      } else if (Math.random() >= .5) {
        battleHistory += `but ${players[player1].name} blocks it, he loses ${players[player2].damage} HP(s).\n`
      } else {
        battleHistory += `but ${players[player1].name} dodges!\n`
      }
 

      player1 = !player1
      player2 = !player2
    }
    messageEmbed.setDescription(battleHistory)
    msg.say(messageEmbed)
  }
}