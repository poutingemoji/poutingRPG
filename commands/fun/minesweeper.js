const { Command } = require('discord.js-commando');
const { prefix } = require("../../config.json");
const Minesweeper = require('discord.js-minesweeper');
const minesweeper = new Minesweeper({
    rows: 12,
    columns: 16,
    mines: 20,
    emote: 'tada',
    returnType: 'code',
});

module.exports = class MinesweeperCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'minesweeper',
			aliases: [],
			group: 'fun',
			memberName: 'minesweeper',
            description: 'Play a game of minesweeper!',
            examples: [`${prefix}minesweeper`],
            clientPermissions: [],
            userPermissions: [],
            guildOnly: true,
            args: [
                {
                  key: 'rows',
                  prompt: 'How many rows?',
                  type: 'integer',
                  min: 4,
                  max: 20
                },
                {
                  key: 'columns',
                  prompt: 'How many columns?',
                  type: 'integer',
                  min: 4,
                  max: 20
                },
                {
                  key: 'mines',
                  prompt: 'How many mines?',
                  type: 'integer',
                  min: 1
                }
            ],
            throttling: {
                usages: 1,
                duration: 20
            },
        });
    };
    async run(message, { rows, columns, mines }) {
        const minesweeper = new Minesweeper({ rows, columns, mines });
        const matrix = minesweeper.start();
     
        return matrix
          ? message.say(matrix)
          : message.say(':warning: The provided data is invalid.');
    }
};
