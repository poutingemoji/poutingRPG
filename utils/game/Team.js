class Team {
  changeSelectedTeam(player, teamId) {
    teamId--;
    player.teamId = teamId;
    this.Database.savePlayer(player);
  }

  addTeamMember(player, characterId, index) {
    const selectedTeam = player.teams[player.teamId] || [];
    const character = this.getCharacter(player, characterId);
    if (!character) return;
    if (index) {
      index--;
      if (!this.isBetween(index, 0, maxTeamMembers)) return;
      selectedTeam[index] = characterId;
    } else {
      if (selectedTeam.length == maxTeamMembers) selectedTeam.shift();
      selectedTeam.push(characterId);
    }
    player.teams[player.teamId] = selectedTeam;
    this.Database.savePlayer(player);
  }

  removeTeamMember(player, characterId) {
    const selectedTeam = player.teams[player.teamId];
    let index;
    if (isNaN(characterId)) {
      const character = this.getCharacter(player, characterId);
      if (!character) return;
      index = selectedTeam.indexOf(characterId);
    } else {
      characterId--;
      index = characterId;
    }
    if (index > -1) selectedTeam.splice(index, 1);
    this.Database.savePlayer(player);
  }
}

module.exports = Team;