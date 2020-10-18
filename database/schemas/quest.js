const newQuest = (type, goal, questId, rewards) => {
  return {
    type: type,
    goal: goal,
    questId: questId,
    progress: 0,
    rewards: rewards,
    updatedAt: Date.now(),
  };
};

module.exports = { newQuest };
