const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const playerSchema = require("./schemas/player");
const Player = mongoose.model("Player", playerSchema);

const { newPlayer } = require("./Objects");

const waitingForRes = new Set();

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

connect();

const Database = {
  waitingForRes: waitingForRes,
  findPlayer(player, msg, sayMsg = true) {
    if (waitingForRes.has(player.id)) {
      msg.say(
        "Please provide a response to the command before executing another."
      );
      return;
    }

    return new Promise((resolve, reject) =>
      Player.findOne({ id: player.id }, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res && sayMsg) {
          const startCommand = `${msg.client.commandPrefix}start`;
          return msg.say(
            msg.author.id == player.id
              ? `Please type \`${startCommand}\` to begin.`
              : `${player.username} hasn't started their adventure. If you know them, tell them to type \`${startCommand}\` to begin.`
          );
        }
        return resolve(res);
      })
    );
  },

  createNewPlayer(player, traits) {
    console.log(player.id, traits);
    return new Promise((resolve, reject) =>
      Player.replaceOne(
        { id: player.id },
        newPlayer(player.id, traits),
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
  },

  loadTopPlayers(sort, where, gte) {
    return Player.find().where(where).gte(gte).sort(sort).exec();
  },

  updateAllPlayers(update) {
    Player.updateMany({}, update, { upsert: true }, (err, res) => {
      console.log(res);
    });
  },
};

module.exports = Database;

/*
  Player.updateMany({  }, 
      { $unset: { myun: 1, soo: 1, quality: 1, physical: 1 } }, 
      { upsert: true },
      (err, res) => {
      console.log(res);
    });
*/
