const newQuest = (type, goal, questId, rewards) => {
  return {
    type: type,
    goal: goal,
    questId: questId,
    progress: 0,
    rewards: rewards,
  };
};

module.exports = { newQuest };
