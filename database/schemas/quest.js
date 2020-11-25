function newQuest(type, goal, questId, rewards) {
  return {
    type,
    goal,
    questId,
    progress: 0,
    rewards,
  };
}

module.exports = { newQuest };
