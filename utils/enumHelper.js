const enumHelper = {
  expFormulas: {
    fast: 'floor(((4*n)^3)/5)',
    mediumfast: 'floor(n^3)',
    mediumslow: 'floor((6/5*n^3)-(15*n^2)+(100*n)-140)',
    slow: 'floor(((5*n)^3)/4)',
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
    fisherman = '#a2716b',
    spearbearer = '#604f41',
    scout = '#92b096',
    lightbearer = '#baa564',
    wavecontroller = '#748394',
  ]
  
}

module.exports = enumHelper