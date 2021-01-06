module.exports = class Instance {
  constructor({name = "", emoji = "", description = ""}) {
    this.name = name;
    this.emoji = emoji;
    this.description = description;
  }
};
