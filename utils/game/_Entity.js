class Entity {
  constructor({ name, emoji = "", description = "" }) {
    this.name = name;
    this.emoji = emoji;
    this.description = description;

    this.level = 1;
    this.weight = 1.0;
    this.spread = 1;
  }
}

module.exports = Entity;
