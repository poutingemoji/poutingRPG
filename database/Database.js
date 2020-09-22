const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const playerSchema = require("./schemas/player");
const Player = mongoose.model("Player", playerSchema);

const { newPlayer } = require("./Objects");

const pets = require("../docs/data/pets.js");

process.on("close", () => {
  console.log("Database disconnecting on app termination");
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  }
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

function connect() {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
}

function disconnect() {
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
}

mongoose.connection.on("error", (err) => {
  console.error(err);
  disconnect();
});

class Database {
  constructor() {
    connect();
  }

  findPlayer(player, msg, sendMsg = true) {
    return new Promise((resolve, reject) =>
      Player.findOne({ playerId: player.id }, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res && sendMsg) {
          return msg.say(msg.author.id == player.id ?  `Please type \`${msg.client.commandPrefix}start\` to begin.` : `${player.username} hasn't started climbing the Tower.`)
        }
        return resolve(res);
      })
    );
  }

  createNewPlayer(player, family, race, position) {
    console.log(player.id, family, race, position);
    return new Promise((resolve, reject) =>
      Player.replaceOne(
        { playerId: player.id },
        newPlayer(player.id, family, race, position),
        { upsert: true },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          console.log(res);
          return resolve(res);
        }
      )
    );
  }

  loadTopPlayers(filter, where, gte) {
    return Player.find().where(where).gte(gte).sort(filter).exec();
  }

  updateAllPlayers() {
    Player.updateMany({ reputation: 0 }, {}, { upsert: true }, (err, res) => {
      console.log(res);
    });
  }
}

module.exports = new Database();
