class User {
    constructor(userId, surname, race, position) {
        this.userId = userId,
        this.exp = 0,
        this.level = 1,
        this.points = 0,
        this.irregular = Math.random() >= 0.5,
        this.surname = surname,
        this.race = race,
        this.position = position,
        this.rank = 30
        this.badges = [],
        this.inventory = {}
    }
  }

  module.exports = User