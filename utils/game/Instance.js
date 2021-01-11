const { capitalCase, snakeCase } = require("change-case");
const emojis = require("../../data/emojis")
module.exports = class Instance {
  constructor({ id, emoji, description = "" }) {
    this.id = id;
    this.name = capitalCase(id);
    this.emoji = emoji ? emoji : emojis[snakeCase(id)] || "";
    this.description = description;
  }
};
