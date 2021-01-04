//DATA
const { newQuest } = require("../database/schemas/quest");
module.exports = [
  {
    name: "Headon's Floor",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752544027410462/Headons_Floor.png",
    chapters: [
      {
        floor: 1,
        area: 0,
        name: "Entering the Tower",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("defeat", 6, "whiteSteelEel", { exp: 100, points: 100 }),
          newQuest("earn", 100, "points"),
          newQuest("use", 5, "skillpoints"),
          newQuest("collect", 5, "fish"),
        ],
      },
    ],
  },
  {
    name: "Evankhell's Hell",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752550155288606/Evankhells_Hell.jpg",
    chapters: [
      {
        name: "1st Floor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Lero-Ro's Test",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752484099457034/Lero-Ros_Test.jpg",
    chapters: [
      {
        name: "1st Floor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Yu Han Sung's Examination",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752503342661692/Yu_Han_Sungs_Examination.jpg",
    chapters: [
      {
        name: "1st Floor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Crown Game",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752478927880242/Crown_Game.jpg",
    chapters: [
      {
        name: "1st Floor",
        emoji: "🚪",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Position Test",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752505712443512/Position_Test.png",
    chapters: [
      {
        name: "1st Floor",
        emoji: "🚪",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Hide-and-Seek",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752480450150460/Hide-and-Seek.webp",
    chapters: [
      {
        name: "1st Floor",
        emoji: "🚪",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Submerged Fish",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752494123581440/Submerged_Fish.png",
    chapters: [
      {
        name: "1st Floor",
        emoji: "🚪",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "testdummy"),
          newQuest("Collect", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Fish", 5, "Fish"),
        ],
      },
    ],
  },
  {
    name: "Last Examination",
    image:
      "https://cdn.discordapp.com/attachments/722720878932262952/751752480232308766/Last_Examination.webp",
    chapters: [
      {
        name: "1st Floor",
        emoji: "🚪",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        quests: [
          newQuest("Defeat", 6, "Test Dummy"),
          newQuest("Earn", 100, "points"),
          newQuest("Use", 5, "skillpoints"),
          newQuest("Collect", 5, "Fish"),
        ],
      },
    ],
  },
];

