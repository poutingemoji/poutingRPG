const emojis = require("./emojis");
const talents = require("./talents");

const positions = {
  fisherman: {
    name: "Fisherman",
    emoji: emojis["fisherman"],
    ultimate: function () {
      //Deals 500 damage to enemy with most health.
    },
    talents: [
      { attack: talents.attack["slash"], support: talents.support["protect"] },
      { attack: "Overpower", support: "Aura of Fortitude" },
      { attack: "Dragon Strike", support: "Defensive Formation" },
      { attack: "Holy Strike", support: "Devotion" },
      { attack: "Revenge", support: "I Dare You!" },
      { attack: "Feral Assault", support: "Ancestral Protection" },
    ],
  },
  waveController: {
    name: "Wave Controller",
    emoji: emojis["wave_controller"],
    ultimate: function () {
      //Immediately launch 5 attacks from random birds.
    },
    talents: [
      {
        attack: talents.attack["shinsuBlast"],
        support: talents.support["shinsuExplosion"],
      },
      { attack: "Energy Drain", support: "Lightning Fast" },
      { attack: "Acid Rain", support: "Healing Rain" },
      { attack: "Chain Lightning", support: "Energize" },
      { attack: "Thunderclap", support: "Rage of Thunder" },
      { attack: "Dancing Spark", support: "Mirror Image" },
    ],
  },
  lightBearer: {
    name: "Light Bearer",
    emoji: emojis["light_bearer"],
    ultimate: function () {
      //All birds are healed by 35% and all harmful effects are removed.
    },
    talents: [
      { attack: "Healing Strike", support: "Healing Shield" },
      { attack: "Thorny Vine", support: "Regrowth" },
      { attack: "Royal Order", support: "Royal Aid" },
      { attack: "Angelic Touch", support: "Spirit Link" },
      { attack: "Heavy Metal", support: "Soothing Song" },
      { attack: "Sinister Smite", support: "Giant Growth" },
    ],
  },
  spearBearer: {
    name: "Spear Bearer",
    emoji: emojis["spear_bearer"],
    ultimate: function () {
      //Deals 150 damage to all enemies.
    },
    talents: [
      { attack: "Pummel", support: "Arrr!" },
      { attack: "Cover Fire", support: "Counter" },
      { attack: "Enrage", support: "Frenzy" },
      { attack: "Raid", support: "Whip Up!" },
      { attack: "Hulk Smash", support: "Gang Up" },
    ],
  },
  scout: {
    name: "Scout",
    emoji: emojis["scout"],
    ultimate: function () {
      //Deal 200 damage to one pig, stun a pig for 1 turn, remove all helpful effects from a pig.
    },
    talents: [
      { attack: "Itching Powder", support: "Cheer" },
      { attack: "Sticky Goo", support: "Cupcake Trap" },
      { attack: "Volley", support: "Ambush" },
      { attack: "Smoke Bomb", support: "Glee" },
      { attack: "Weak Spot", support: "Tricksy Trick" },
    ],
  },
  /*
  SPECIAL POSITIONS
  Guides
  Anima
  Jeonsulsa
  Hwayeomsa
  targeted
  Unknown Position
  */
};

module.exports = positions;
