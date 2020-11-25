const emojis = require("./emojis")
const positions = {
  fisherman: {
    name: "Fisherman",
    emoji: emojis["fisherman"],
    ultimate: function() {
      //Deals 500 damage to enemy with most health.
    },
    talents: [
      {attack: "Attack", defend: "Protect"},
      {attack: "Overpower", defend: "Aura of Fortitude"},
      {attack: "Dragon Strike", defend: "Defensive Formation"},
      {attack: "Holy Strike", defend: "Devotion"},
      {attack: "Revenge", defend: "I Dare You!"},
      {attack: "Feral Assault", defend: "Ancestral Protection"},
    ]
  },
  waveController: {
    name: "Wave Controller",
    emoji: emojis["wave_controller"],
    ultimate: function() {
      //Immediately launch 5 attacks from random birds.
    },
    talents: [
      {attack: "Storm", defend: "Shock Shield"},
      {attack: "Energy Drain", defend: "Lightning Fast"},
      {attack: "Acid Rain", defend: "Healing Rain"},
      {attack: "Chain Lightning", defend: "Energize"},
      {attack: "Thunderclap", defend: "Rage of Thunder"},
      {attack: "Dancing Spark", defend: "Mirror Image"},
    ]
  },
  lightBearer: {
    name: "Light Bearer",
    emoji: emojis["light_bearer"],
    ultimate: function() {
      //All birds are healed by 35% and all harmful effects are removed.
    },
    talents: [
      {attack: "Healing Strike", defend: "Healing Shield"},
      {attack: "Thorny Vine", defend: "Regrowth"},
      {attack: "Royal Order", defend: "Royal Aid"},
      {attack: "Angelic Touch", defend: "Spirit Link"},
      {attack: "Heavy Metal", defend: "Soothing Song"},
      {attack: "Sinister Smite", defend: "Giant Growth"},
    ]
  },
  spearBearer: {
    name: "Spear Bearer",
    emoji: emojis["spear_bearer"],
    ultimate: function() {
      //Deals 150 damage to all enemies.
    },
    talents: [
      {attack: "Pummel", defend: "Arrr!"},
      {attack: "Cover Fire", defend: "Counter"},
      {attack: "Enrage", defend: "Frenzy"},
      {attack: "Raid", defend: "Whip Up!"},
      {attack: "Hulk Smash", defend: "Gang Up"},
    ]
  },
  scout: {
    name: "Scout",
    emoji: emojis["scout"],
    ultimate: function() {
      //Deal 200 damage to one pig, stun a pig for 1 turn, remove all helpful effects from a pig.
    },
    talents: [
      {attack: "Itching Powder", defend: "Cheer"},
      {attack: "Sticky Goo", defend: "Cupcake Trap"},
      {attack: "Volley", defend: "Ambush"},
      {attack: "Smoke Bomb", defend: "Glee"},
      {attack: "Weak Spot", defend: "Tricksy Trick"},
    ]
  },
};

module.exports = positions;
