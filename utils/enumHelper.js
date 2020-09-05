const enumHelper = {
  expFormulas: {
    fast: 'floor(((4*n)^3)/5)',
    mediumfast: 'floor(n^3)',
    mediumslow: 'floor((6/5*n^3)-(15*n^2)+(100*n)-140)',
    slow: 'floor(((5*n)^3)/4)',
  },
  maxHealth: (level) => {
    return 100 + (level * 5);
  },
  maxShinsu: (level) => {
    return 50 + (level * 5);
  },
  petNeeds: [
    'hunger', 
    'hygiene', 
    'fun', 
    'energy',
  ],
  petActions: {
    feed: 'hunger',
    wash: 'hygiene',
    play: 'fun',
    walk: 'energy',
  },
  positionColors: [
    fisherman = '#db3043',
    spearbearer = '#c06850',
    scout = '#79b15a',
    lightbearer = '#ffd984',
    wavecontroller = '#50a5e6',
  ]
  
}

module.exports = enumHelper