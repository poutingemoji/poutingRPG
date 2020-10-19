//BASE
const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  guild: String,
  settings: {
    prefix: String,
    spawnsEnabled: Array,
  },
});

const newSettingObj = (guild) => {
  return {
    guild,
  };
};

module.exports = { settingSchema, newSettingObj };
