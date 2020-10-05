const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: String,

  level: Number,
  EXP: Number,
  Max_EXP: Number,

  selected_Character: String,
  characters_Owned: {},
  inventory: {},

  energy: Number,
  updated_At: Date,

  points: Number,
  dallars: Number,

  arc: Number,
  chapter: Number,
  quests: Array,
  commissions: Array,
});

module.exports = playerSchema;
