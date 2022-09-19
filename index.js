// change settings here.
const gameConfig = {
    //game config
    timeBetweenMoves: 500,
    //display
    fpsInterval: 1000 / 20,
    displayScore: true,
    // ai config
    aiInterval: 1000 / 10,
    aggregateHeight: -0.510066,
    lines: 0.760666,
    holes: -0.35663,
    bumpiness: -0.184483,
    // shared
    numberOfRows: 20,
    numberOfColumns: 10,
    pixelsPerBlock: 20,
}

if (!gameConfig.displayScore) {
    document.querySelector('#score').style.display = 'none';
}

const gameWorker = new Worker('./game/index.js', {
    type: 'module'
});
/*
const aiWorker = new Worker('./game/ai.js', {
    type: 'module'
})
aiWorker.postMessage({
    gameWorker: gameWorker
})*/

import Display from './display/index.js';

const display = new Display(gameWorker, gameConfig);

gameWorker.postMessage({
    name: 'config',
    config: gameConfig
})

/*
aiWorker.postMessage({
    name: 'config',
    config: gameConfig
})*/