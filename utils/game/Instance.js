const { camelCase } = require("change-case");
module.exports = class Instance {
  constructor({ name, emoji = "", description = "" }) {
    this.id = camelCase(name);
    this.name = name;
    this.emoji = emoji;
    this.description = description;
  }
};
