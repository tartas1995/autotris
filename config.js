const gameConfigTypes = {
    //game config
    timeBetweenMoves: 'number',
    //display
    fpsInterval: 'number',
    displayScore: 'boolean',
    color: 'string',
    fontSize: 'string',
    fontFamily: 'string',
    pixelsPerBlock: 'number',
    // ai config
    aiInterval: 'number',
    aggregateHeight: 'number',
    lines: 'number',
    holes: 'number',
    bumpiness: 'number',
    // shared
    numberOfRows: 'number',
    numberOfColumns: 'number',
}

// change settings here.
const gameConfig = {
    //game config
    timeBetweenMoves: 100,
    //display
    fpsInterval: 1000 / 20,
    displayScore: true,
    color: 'white',
    fontSize: '1em',
    fontFamily: 'auto',
    // ai config
    aiInterval: 1000 / 30,
    aggregateHeight: -0.510066,
    lines: 0.760666,
    holes: -0.35663,
    bumpiness: -0.184483,
    // shared
    numberOfRows: 20,
    numberOfColumns: 10,
    pixelsPerBlock: 20,
}

export {
    gameConfig,
    gameConfigTypes
}